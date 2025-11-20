import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { validateRequest, MatchIdSchema, corsHeaders } from "../_shared/validation.ts";
import { 
  protectEndpoint, 
  requireAdminOrAnalyst, 
  createAuthErrorResponse, 
  logAuditAction,
  handleCorsPreflight 
} from "../_shared/auth.ts";
import { 
  generatePredictionId, 
  logPredictionEvent, 
  getModelVersion 
} from "../_shared/evaluation-logging.ts";

interface MatchResult {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number;
  away_score: number;
  match_date: string;
}

interface Pattern {
  template_name: string;
  confidence_boost: number;
  data: Record<string, unknown>;
}

// Helper: Get recent matches for a team
async function getRecentMatches(
  supabase: SupabaseClient,
  teamId: string,
  limit: number
): Promise<MatchResult[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .eq('status', 'finished')
    .order('match_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent matches:', error);
    return [];
  }

  return data || [];
}

// Helper: Get H2H matches between two teams
async function getH2HMatches(
  supabase: SupabaseClient,
  team1Id: string,
  team2Id: string,
  limit: number
): Promise<MatchResult[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`and(home_team_id.eq.${team1Id},away_team_id.eq.${team2Id}),and(home_team_id.eq.${team2Id},away_team_id.eq.${team1Id})`)
    .eq('status', 'finished')
    .order('match_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching H2H matches:', error);
    return [];
  }

  return data || [];
}

// Helper: Calculate form score (0-100)
function calculateFormScore(matches: MatchResult[], teamId: string): number {
  if (matches.length === 0) return 50; // Neutral if no data

  let score = 0;
  matches.forEach(match => {
    const isHome = match.home_team_id === teamId;
    const teamScore = isHome ? match.home_score : match.away_score;
    const opponentScore = isHome ? match.away_score : match.home_score;

    if (teamScore > opponentScore) score += 20; // Win
    else if (teamScore === opponentScore) score += 10; // Draw
    // Loss = 0 points
  });

  return Math.min(score, 100);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight();
  }

  try {
    // Authenticate and authorize the request
    const authResult = await protectEndpoint(
      req.headers.get('Authorization'),
      requireAdminOrAnalyst
    );

    if ('error' in authResult) {
      return createAuthErrorResponse(authResult.error);
    }

    const { context } = authResult;
    const { serviceClient: supabase } = context;

    // Validate input
    const body = await req.json()
    const validation = validateRequest(MatchIdSchema, body)
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: validation.error, details: validation.details }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { matchId } = validation.data

    // Generate unique prediction ID for tracking
    const predictionId = generatePredictionId();
    console.log(`🆔 Generated prediction ID: ${predictionId} for match: ${matchId}`);

    // Get current model version
    const modelVersion = await getModelVersion();

    // 1. Fetch match details
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(id, name),
        away_team:teams!away_team_id(id, name),
        league:leagues(id, name, avg_goals_per_match)
      `)
      .eq('id', matchId)
      .single();

    if (matchError || !match) {
      console.error('Match not found:', matchError);
      return new Response(
        JSON.stringify({ error: 'Match not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch recent form (last 5 matches for each team)
    const homeRecentMatches = await getRecentMatches(supabase, match.home_team.id, 5);
    const awayRecentMatches = await getRecentMatches(supabase, match.away_team.id, 5);

    // 3. Fetch H2H history
    const h2hMatches = await getH2HMatches(supabase, match.home_team.id, match.away_team.id, 5);

    // 4. Detect patterns
    const detectedPatterns: Pattern[] = [];

    // Pattern 1: Home winning streak (home matches only)
    const homeHomeMatches = homeRecentMatches.filter(m => m.home_team_id === match.home_team.id);
    const homeWins = homeHomeMatches.filter(m => m.home_score > m.away_score).length;
    if (homeWins >= 3) {
      detectedPatterns.push({
        template_name: 'home_winning_streak',
        confidence_boost: 8.0,
        data: { wins: homeWins, total: homeHomeMatches.length }
      });
    }

    // Pattern 2: Away winning streak (away matches only)
    const awayAwayMatches = awayRecentMatches.filter(m => m.away_team_id === match.away_team.id);
    const awayWins = awayAwayMatches.filter(m => m.away_score > m.home_score).length;
    if (awayWins >= 3) {
      detectedPatterns.push({
        template_name: 'away_winning_streak',
        confidence_boost: 7.0,
        data: { wins: awayWins, total: awayAwayMatches.length }
      });
    }

    // Pattern 3: H2H dominance
    if (h2hMatches.length >= 3) {
      const homeH2HWins = h2hMatches.filter(m => {
        const isHomeInH2H = m.home_team_id === match.home_team.id;
        return isHomeInH2H 
          ? m.home_score > m.away_score 
          : m.away_score > m.home_score;
      }).length;

      if (homeH2HWins >= 3) {
        detectedPatterns.push({
          template_name: 'h2h_dominance',
          confidence_boost: 10.0,
          data: { home_wins: homeH2HWins, total: h2hMatches.length }
        });
      }
    }

    // Pattern 4: Recent form advantage
    const homeFormScore = calculateFormScore(homeRecentMatches, match.home_team.id);
    const awayFormScore = calculateFormScore(awayRecentMatches, match.away_team.id);
    
    if (homeFormScore - awayFormScore >= 40) { // 2+ more wins
      detectedPatterns.push({
        template_name: 'recent_form_advantage',
        confidence_boost: 6.0,
        data: { home_form: homeFormScore, away_form: awayFormScore }
      });
    }

    // Pattern 5: High scoring league
    if (match.league.avg_goals_per_match > 3.0) {
      detectedPatterns.push({
        template_name: 'high_scoring_league',
        confidence_boost: 3.0,
        data: { avg_goals: match.league.avg_goals_per_match }
      });
    }

    // 5. Calculate confidence
    let confidence = 50.0; // Base confidence
    detectedPatterns.forEach(p => {
      confidence += p.confidence_boost;
    });
    confidence = Math.min(confidence, 95.0); // Cap at 95%

    // 6. Determine predicted outcome
    let predictedOutcome = 'draw';
    if (homeFormScore > awayFormScore + 20) {
      predictedOutcome = 'home_win';
    } else if (awayFormScore > homeFormScore + 20) {
      predictedOutcome = 'away_win';
    }

    // 7. Save prediction
    const { data: prediction, error: predError } = await supabase
      .from('predictions')
      .insert({
        prediction_id: predictionId, // Add tracking ID
        match_id: matchId,
        predicted_outcome: predictedOutcome,
        confidence_score: confidence,
        css_score: confidence, // CSS Score for calibration
        model_version: modelVersion, // Track model version for performance analysis
        prediction_factors: {
          patterns: detectedPatterns.map(p => p.template_name),
          pattern_count: detectedPatterns.length,
          form_scores: {
            home: homeFormScore,
            away: awayFormScore
          },
          h2h: {
            matches_analyzed: h2hMatches.length,
            home_wins: h2hMatches.filter(m => {
              const isHomeTeam = m.home_team_id === match.home_team.id;
              const teamScore = isHomeTeam ? m.home_score : m.away_score;
              const oppScore = isHomeTeam ? m.away_score : m.home_score;
              return teamScore > oppScore;
            }).length,
            away_wins: h2hMatches.filter(m => {
              const isAwayTeamHome = m.home_team_id === match.away_team.id;
              const teamScore = isAwayTeamHome ? m.home_score : m.away_score;
              const oppScore = isAwayTeamHome ? m.away_score : m.home_score;
              return teamScore > oppScore;
            }).length
          },
          league_context: {
            avg_goals_per_match: match.league.avg_goals_per_match,
            league_name: match.league.name
          }
        },
        calibration_error: null,
        btts_prediction: match.league.avg_goals_per_match > 2.5
      })
      .select()
      .single();

    if (predError) {
      console.error('Error saving prediction:', predError);
      return new Response(
        JSON.stringify({ error: 'Failed to save prediction', details: predError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 8. Log prediction event to evaluation log
    try {
      await logPredictionEvent(
        predictionId,
        match.home_team.name,
        match.away_team.name,
        confidence / 100, // Convert to 0-1 range
        predictedOutcome,
        null, // actual_result is null at prediction time
        modelVersion
      );
    } catch (logError) {
      console.error('Error logging prediction event:', logError);
      // Don't fail the request, just log the error
    }

    // 9. Save detected patterns
    for (const pattern of detectedPatterns) {
      const { data: template } = await supabase
        .from('pattern_templates')
        .select('id')
        .eq('name', pattern.template_name)
        .single();

      if (template) {
        await supabase.from('detected_patterns').insert({
          match_id: matchId,
          template_id: template.id,
          confidence_contribution: pattern.confidence_boost,
          pattern_data: pattern.data
        });
      }
    }

    // Log the action for audit
    await logAuditAction(
      context.supabaseClient,
      context.user.id,
      'analyze_match',
      'match',
      matchId,
      {
        predicted_outcome: predictedOutcome,
        confidence_score: confidence,
        patterns_detected: detectedPatterns.length
      },
      context.user.email
    );

    console.log(`✅ Prediction created for match ${matchId}: ${predictedOutcome} (${confidence}%) by ${context.user.email}`);

    return new Response(
      JSON.stringify({ 
        prediction: {
          ...prediction,
          prediction_id: predictionId // Include tracking ID in response
        }, 
        patterns: detectedPatterns,
        form_scores: { home: homeFormScore, away: awayFormScore },
        prediction_id: predictionId // Also include at top level for easy access
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-match:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

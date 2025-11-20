/**
 * Ensemble Predictor for combining multiple sub-model predictions.
 * 
 * This module implements a weighted voting system that aggregates predictions
 * from three sub-models:
 * - Full-time Model (FT): Primary model with highest weight
 * - Half-time Model (HT): Intermediate predictions
 * - Pattern-based Model (PT): Pattern recognition model
 * 
 * Key features:
 * - Configurable weights (default: FT=0.5, HT=0.3, PT=0.2)
 * - Dynamic re-weighting when sub-models return null
 * - Conflict detection when top 2 outcomes have similar scores
 * - Deterministic output for reproducibility
 */

export interface ModelWeights {
  ft: number;  // Full-time model weight
  ht: number;  // Half-time model weight
  pt: number;  // Pattern model weight
}

export interface ModelPrediction {
  prediction: string;
  confidence: number;
}

export interface EnsembleVotes {
  full_time?: ModelPrediction;
  half_time?: ModelPrediction;
  pattern?: ModelPrediction;
}

export interface OutcomeScores {
  HOME: number;
  DRAW: number;
  AWAY: number;
}

export interface EnsembleResult {
  weights_used: ModelWeights;
  votes: EnsembleVotes;
  scores: OutcomeScores;
  winner: string;
  final_confidence: number;
  conflict_detected: boolean;
  conflict_margin: number;
}

export interface EnsemblePredictionInput {
  full_time_prediction?: string | null;
  full_time_confidence?: number | null;
  half_time_prediction?: string | null;
  half_time_confidence?: number | null;
  pattern_prediction?: string | null;
  pattern_confidence?: number | null;
}

export class EnsemblePredictor {
  // Default configuration weights
  static readonly DEFAULT_WEIGHTS: ModelWeights = {
    ft: 0.5,  // Full-time model
    ht: 0.3,  // Half-time model
    pt: 0.2,  // Pattern model
  };
  
  // Conflict threshold: if top 2 scores differ by less than this, flag as conflict
  static readonly CONFLICT_THRESHOLD = 0.1;
  
  // Valid outcomes
  private static readonly VALID_OUTCOMES = new Set([
    'HOME', 'DRAW', 'AWAY', 'home_win', 'draw', 'away_win'
  ]);
  
  private weights: ModelWeights;
  
  constructor(weights?: Partial<ModelWeights>) {
    this.weights = {
      ...EnsemblePredictor.DEFAULT_WEIGHTS,
      ...weights
    };
    this.validateWeights();
  }
  
  private validateWeights(): void {
    const { ft, ht, pt } = this.weights;
    
    if (ft < 0 || ht < 0 || pt < 0) {
      throw new Error('All weights must be non-negative');
    }
    
    const total = ft + ht + pt;
    if (total < 0.99 || total > 1.01) {
      console.warn(`Weights sum to ${total}, not 1.0. Will normalize during prediction.`);
    }
  }
  
  private normalizeOutcome(outcome: string): 'HOME' | 'DRAW' | 'AWAY' {
    const outcomeUpper = outcome.toUpperCase();
    if (outcomeUpper === 'HOME' || outcomeUpper === 'HOME_WIN') {
      return 'HOME';
    } else if (outcomeUpper === 'DRAW') {
      return 'DRAW';
    } else if (outcomeUpper === 'AWAY' || outcomeUpper === 'AWAY_WIN') {
      return 'AWAY';
    } else {
      throw new Error(`Invalid outcome: ${outcome}`);
    }
  }
  
  private normalizeOutcomeForOutput(outcome: 'HOME' | 'DRAW' | 'AWAY'): string {
    if (outcome === 'HOME') {
      return 'home_win';
    } else if (outcome === 'DRAW') {
      return 'draw';
    } else if (outcome === 'AWAY') {
      return 'away_win';
    }
    return outcome;
  }
  
  predict(input: EnsemblePredictionInput): EnsembleResult {
    const {
      full_time_prediction,
      full_time_confidence,
      half_time_prediction,
      half_time_confidence,
      pattern_prediction,
      pattern_confidence
    } = input;
    
    // Collect valid models
    interface ModelInfo {
      name: 'full_time' | 'half_time' | 'pattern';
      prediction: string;
      confidence: number;
      weightKey: 'ft' | 'ht' | 'pt';
    }
    
    const models: ModelInfo[] = [];
    
    if (full_time_prediction != null && full_time_confidence != null) {
      models.push({
        name: 'full_time',
        prediction: full_time_prediction,
        confidence: full_time_confidence,
        weightKey: 'ft'
      });
    }
    
    if (half_time_prediction != null && half_time_confidence != null) {
      models.push({
        name: 'half_time',
        prediction: half_time_prediction,
        confidence: half_time_confidence,
        weightKey: 'ht'
      });
    }
    
    if (pattern_prediction != null && pattern_confidence != null) {
      models.push({
        name: 'pattern',
        prediction: pattern_prediction,
        confidence: pattern_confidence,
        weightKey: 'pt'
      });
    }
    
    if (models.length === 0) {
      throw new Error('At least one sub-model prediction must be provided');
    }
    
    // Calculate total weight of active models
    const totalWeight = models.reduce((sum, model) => sum + this.weights[model.weightKey], 0);
    
    if (totalWeight === 0) {
      throw new Error('Total weight of active models is zero');
    }
    
    // Normalize weights for active models only
    const normalizedWeights: Partial<ModelWeights> = {};
    for (const model of models) {
      normalizedWeights[model.weightKey] = this.weights[model.weightKey] / totalWeight;
    }
    
    // Initialize scores for each outcome
    const scores: OutcomeScores = { HOME: 0, DRAW: 0, AWAY: 0 };
    
    // Aggregate scores using weighted voting
    const votes: EnsembleVotes = {};
    
    for (const model of models) {
      // Validate confidence is in range
      if (model.confidence < 0 || model.confidence > 1) {
        throw new Error(
          `${model.name} confidence must be in range [0, 1], got ${model.confidence}`
        );
      }
      
      // Normalize outcome
      const normalizedOutcome = this.normalizeOutcome(model.prediction);
      
      // Add weighted contribution to outcome score
      const weight = normalizedWeights[model.weightKey]!;
      scores[normalizedOutcome] += model.confidence * weight;
      
      // Record vote
      votes[model.name] = {
        prediction: model.prediction,
        confidence: model.confidence
      };
    }
    
    // Determine winner (outcome with highest score)
    const entries = Object.entries(scores) as [keyof OutcomeScores, number][];
    const [winner, finalConfidence] = entries.reduce((max, entry) => 
      entry[1] > max[1] ? entry : max
    );
    
    // Check for conflict
    const sortedScores = Object.values(scores).sort((a, b) => b - a);
    const conflictMargin = sortedScores.length > 1 
      ? sortedScores[0] - sortedScores[1] 
      : sortedScores[0];
    const conflictDetected = conflictMargin < EnsemblePredictor.CONFLICT_THRESHOLD;
    
    // Build complete weights_used dict (including zeros for inactive models)
    const weightsUsed: ModelWeights = {
      ft: normalizedWeights.ft ?? 0,
      ht: normalizedWeights.ht ?? 0,
      pt: normalizedWeights.pt ?? 0
    };
    
    // Build result
    const result: EnsembleResult = {
      weights_used: weightsUsed,
      votes,
      scores,
      winner: this.normalizeOutcomeForOutput(winner),
      final_confidence: Math.round(finalConfidence * 10000) / 10000, // Round to 4 decimals
      conflict_detected: conflictDetected,
      conflict_margin: Math.round(conflictMargin * 10000) / 10000
    };
    
    console.log(
      `Ensemble prediction: ${result.winner} ` +
      `(confidence: ${result.final_confidence}, conflict: ${conflictDetected})`
    );
    
    return result;
  }
  
  getConfig(): ModelWeights {
    return { ...this.weights };
  }
  
  updateConfig(newWeights: Partial<ModelWeights>): void {
    const oldWeights = { ...this.weights };
    this.weights = {
      ...this.weights,
      ...newWeights
    };
    
    try {
      this.validateWeights();
      console.log(`Updated weights from`, oldWeights, `to`, this.weights);
    } catch (error) {
      this.weights = oldWeights;
      throw new Error(`Invalid weights: ${error instanceof Error ? error.message : error}`);
    }
  }
}

/**
 * Factory function to create an EnsemblePredictor instance.
 */
export function createEnsemblePredictor(weights?: Partial<ModelWeights>): EnsemblePredictor {
  return new EnsemblePredictor(weights);
}


import { supabase } from '@/integrations/supabase/client';

class SportRadarService {
  private async fetchWithProxy(endpoint: string, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log('Making proxy request to SportRadar for endpoint:', endpoint);
      
      const { data, error } = await supabase.functions.invoke('sportradar-proxy', {
        body: { path: endpoint }
      });

      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Proxy Error: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No data received from proxy');
      }
      
      // Convert the data to a Response-like object for compatibility
      return {
        ok: true,
        json: async () => data,
        text: async () => JSON.stringify(data),
        status: 200,
        statusText: 'OK'
      } as Response;
      
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Proxy fetch error:', error);
      throw error;
    }
  }

  async getCompetitions(): Promise<any> {
    try {
      const response = await this.fetchWithProxy('/competitions.json');
      return await response.json();
    } catch (error) {
      console.error('Error fetching competitions:', error);
      throw new Error('Nem sikerült betölteni a versenysorozatokat');
    }
  }

  async getSeasonCompetitors(seasonId: string): Promise<any> {
    try {
      const response = await this.fetchWithProxy(`/seasons/${encodeURIComponent(seasonId)}/competitors.json`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching season competitors:', error);
      throw new Error('Nem sikerült betölteni a csapatokat');
    }
  }

  async getCompetitorStatistics(seasonId: string, competitorId: string): Promise<any> {
    try {
      const response = await this.fetchWithProxy(
        `/seasons/${encodeURIComponent(seasonId)}/competitors/${encodeURIComponent(competitorId)}/statistics.json`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching competitor statistics:', error);
      throw new Error('Nem sikerült betölteni a csapat statisztikáit');
    }
  }

  async getSeasonStandings(seasonId: string): Promise<any> {
    try {
      const response = await this.fetchWithProxy(`/seasons/${encodeURIComponent(seasonId)}/standings.json`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching season standings:', error);
      throw new Error('Nem sikerült betölteni a tabellát');
    }
  }

  async getCompetitorVsCompetitor(competitor1Id: string, competitor2Id: string): Promise<any> {
    try {
      const response = await this.fetchWithProxy(
        `/competitors/${encodeURIComponent(competitor1Id)}/versus/${encodeURIComponent(competitor2Id)}/matches.json`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching H2H data:', error);
      throw new Error('Nem sikerült betölteni a közvetlen összecsapásokat');
    }
  }

  async getCompetitionInfo(competitionId: string): Promise<any> {
    try {
      const response = await this.fetchWithProxy(
        `/competitions/${encodeURIComponent(competitionId)}/info.json`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching competition info:', error);
      throw new Error('Nem sikerült betölteni a versenysorozat információit');
    }
  }

  async getCompetitionSeasons(competitionId: string): Promise<any> {
    try {
      const response = await this.fetchWithProxy(`/competitions/${encodeURIComponent(competitionId)}/seasons.json`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching competition seasons:', error);
      throw new Error('Nem sikerült betölteni a versenysorozat szezonjait');
    }
  }

  async getCompetitorProfile(competitorId: string): Promise<any> {
    try {
      const response = await this.fetchWithProxy(`/competitors/${encodeURIComponent(competitorId)}/profile.json`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching competitor profile:', error);
      throw new Error('Nem sikerült betölteni a csapat profilját');
    }
  }

  async getDailyMatches(date: string): Promise<any> {
    try {
      console.log('Fetching daily matches for date:', date);
      const response = await this.fetchWithProxy(`/schedules/${date}/summaries.json`);
      const data = await response.json();
      console.log('Daily matches response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching daily matches:', error);
      throw new Error('Nem sikerült betölteni a napi mérkőzéseket');
    }
  }
}

export const sportRadarService = new SportRadarService();

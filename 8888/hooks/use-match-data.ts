import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface Team {
  id: string;
  name: string;
  logo?: string;
}

export interface Score {
  home: number;
  away: number;
}

export interface Match {
  id: string;
  date: string;
  home: Team;
  away: Team;
  htScore: Score;
  ftScore: Score;
  btts: boolean;
  comeback: boolean;
}

export interface MatchFilters {
  homeTeam?: Team | null;
  awayTeam?: Team | null;
  btts?: boolean | null;
  comeback?: boolean | null;
  startDate?: string | null;
  endDate?: string | null;
  minHomeGoals?: number;
  maxHomeGoals?: number;
  minAwayGoals?: number;
  maxAwayGoals?: number;
  resultType?: 'H' | 'D' | 'A' | null;
  htftCombination?: string | null;
}

export interface MatchStats {
  total: number;
  homeWins: number;
  draws: number;
  awayWins: number;
  bttsCount: number;
  comebackCount: number;
  homeGoals: number;
  awayGoals: number;
  frequentResults: Array<{
    result: string;
    count: number;
    percentage: number;
  }>;
}

export type SortKey = 'home' | 'away' | 'ht' | 'ft' | 'btts' | 'comeback' | 'date';
export type SortDirection = 'asc' | 'desc';

export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface UseMatchDataReturn {
  // Data
  matches: Match[];
  filteredMatches: Match[];
  stats: MatchStats;
  teams: Team[];
  
  // Loading states
  isLoading: boolean;
  isLoadingPage: boolean;
  error: string | null;
  
  // Filtering
  filters: MatchFilters;
  setFilters: (filters: Partial<MatchFilters>) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  
  // Sorting
  sortKey: SortKey;
  sortDirection: SortDirection;
  setSorting: (key: SortKey, direction: SortDirection) => void;
  
  // Pagination
  pagination: PaginationConfig;
  setPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  
  // Actions
  exportToCSV: () => void;
}

// Context type for provider pattern
export interface MatchDataContextType extends UseMatchDataReturn {}

export interface MatchDataProviderProps {
  children: React.ReactNode;
  initialMatches?: Match[];
}

// =============================================
// UTILITIES
// =============================================

const STORAGE_KEY = 'match-data-filters';

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// =============================================
// CONTEXT SETUP
// =============================================

const MatchDataContext = createContext<MatchDataContextType | undefined>(undefined);

// =============================================
// CORE HOOK LOGIC (used by both standalone and provider)
// =============================================

const useMatchDataLogic = (initialMatches: Match[] = []): UseMatchDataReturn => {
  // =============================================
  // STATE MANAGEMENT
  // =============================================
  
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters state
  const [filters, setFiltersState] = useState<MatchFilters>(() => 
    loadFromStorage(STORAGE_KEY, {})
  );
  
  // Sorting state
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // =============================================
  // COMPUTED VALUES
  // =============================================
  
  const teams = useMemo(() => {
    const teamMap = new Map<string, Team>();
    
    matches.forEach(match => {
      if (!teamMap.has(match.home.id)) {
        teamMap.set(match.home.id, match.home);
      }
      if (!teamMap.has(match.away.id)) {
        teamMap.set(match.away.id, match.away);
      }
    });
    
    return Array.from(teamMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [matches]);

  const stats = useMemo((): MatchStats => {
    const matchesToAnalyze = filteredMatches;
    
    let homeWins = 0;
    let draws = 0;
    let awayWins = 0;
    let bttsCount = 0;
    let comebackCount = 0;
    let homeGoals = 0;
    let awayGoals = 0;
    
    const resultCounts: Record<string, number> = {};
    
    matchesToAnalyze.forEach(match => {
      // Results
      if (match.ftScore.home > match.ftScore.away) {
        homeWins++;
      } else if (match.ftScore.home === match.ftScore.away) {
        draws++;
      } else {
        awayWins++;
      }
      
      // Special conditions
      if (match.btts) bttsCount++;
      if (match.comeback) comebackCount++;
      
      // Goals
      homeGoals += match.ftScore.home;
      awayGoals += match.ftScore.away;
      
      // Result frequencies
      const resultKey = `${match.ftScore.home}-${match.ftScore.away}`;
      resultCounts[resultKey] = (resultCounts[resultKey] || 0) + 1;
    });
    
    const frequentResults = Object.entries(resultCounts)
      .map(([result, count]) => ({
        result,
        count,
        percentage: (count / matchesToAnalyze.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      total: matchesToAnalyze.length,
      homeWins,
      draws,
      awayWins,
      bttsCount,
      comebackCount,
      homeGoals,
      awayGoals,
      frequentResults
    };
  }, [filteredMatches]);

  const pagination = useMemo((): PaginationConfig => ({
    currentPage,
    itemsPerPage,
    totalItems: filteredMatches.length
  }), [currentPage, itemsPerPage, filteredMatches.length]);

  // =============================================
  // FILTERING LOGIC
  // =============================================
  
  const applyMatchFilters = useCallback((matchesToFilter: Match[], appliedFilters: MatchFilters): Match[] => {
    let result = [...matchesToFilter];
    
    // Team filters
    if (appliedFilters.homeTeam) {
      result = result.filter(match => match.home.id === appliedFilters.homeTeam!.id);
    }
    
    if (appliedFilters.awayTeam) {
      result = result.filter(match => match.away.id === appliedFilters.awayTeam!.id);
    }
    
    // Boolean filters
    if (appliedFilters.btts !== null && appliedFilters.btts !== undefined) {
      result = result.filter(match => match.btts === appliedFilters.btts);
    }
    
    if (appliedFilters.comeback !== null && appliedFilters.comeback !== undefined) {
      result = result.filter(match => match.comeback === appliedFilters.comeback);
    }
    
    // Date range filters
    if (appliedFilters.startDate) {
      const startDate = new Date(appliedFilters.startDate);
      result = result.filter(match => new Date(match.date) >= startDate);
    }
    
    if (appliedFilters.endDate) {
      const endDate = new Date(appliedFilters.endDate);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(match => new Date(match.date) <= endDate);
    }
    
    // Goal range filters
    if (appliedFilters.minHomeGoals !== undefined) {
      result = result.filter(match => match.ftScore.home >= appliedFilters.minHomeGoals!);
    }
    
    if (appliedFilters.maxHomeGoals !== undefined) {
      result = result.filter(match => match.ftScore.home <= appliedFilters.maxHomeGoals!);
    }
    
    if (appliedFilters.minAwayGoals !== undefined) {
      result = result.filter(match => match.ftScore.away >= appliedFilters.minAwayGoals!);
    }
    
    if (appliedFilters.maxAwayGoals !== undefined) {
      result = result.filter(match => match.ftScore.away <= appliedFilters.maxAwayGoals!);
    }
    
    // Result type filter
    if (appliedFilters.resultType) {
      const { resultType } = appliedFilters;
      result = result.filter(match => {
        if (resultType === 'H') return match.ftScore.home > match.ftScore.away;
        if (resultType === 'D') return match.ftScore.home === match.ftScore.away;
        if (resultType === 'A') return match.ftScore.home < match.ftScore.away;
        return true;
      });
    }
    
    // HT/FT combination filter
    if (appliedFilters.htftCombination && appliedFilters.htftCombination.length === 2) {
      const [ht, ft] = appliedFilters.htftCombination;
      
      result = result.filter(match => {
        // Half-time result check
        let htMatch = true;
        if (ht === 'H') htMatch = match.htScore.home > match.htScore.away;
        else if (ht === 'D') htMatch = match.htScore.home === match.htScore.away;
        else if (ht === 'A') htMatch = match.htScore.home < match.htScore.away;
        
        // Full-time result check
        let ftMatch = true;
        if (ft === 'H') ftMatch = match.ftScore.home > match.ftScore.away;
        else if (ft === 'D') ftMatch = match.ftScore.home === match.ftScore.away;
        else if (ft === 'A') ftMatch = match.ftScore.home < match.ftScore.away;
        
        return htMatch && ftMatch;
      });
    }
    
    return result;
  }, []);

  // =============================================
  // SORTING LOGIC
  // =============================================
  
  const applySorting = useCallback((matchesToSort: Match[], key: SortKey, direction: SortDirection): Match[] => {
    return [...matchesToSort].sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (key) {
        case 'home':
          valueA = a.home.name;
          valueB = b.home.name;
          break;
        case 'away':
          valueA = a.away.name;
          valueB = b.away.name;
          break;
        case 'date':
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;
        case 'ht':
          valueA = `${a.htScore.home}-${a.htScore.away}`;
          valueB = `${b.htScore.home}-${b.htScore.away}`;
          break;
        case 'ft':
          valueA = `${a.ftScore.home}-${a.ftScore.away}`;
          valueB = `${b.ftScore.home}-${b.ftScore.away}`;
          break;
        case 'btts':
          valueA = a.btts ? 1 : 0;
          valueB = b.btts ? 1 : 0;
          break;
        case 'comeback':
          valueA = a.comeback ? 1 : 0;
          valueB = b.comeback ? 1 : 0;
          break;
        default:
          valueA = a.date;
          valueB = b.date;
      }
      
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, []);

  // =============================================
  // PAGINATION LOGIC
  // =============================================
  
  const applyPagination = useCallback((matchesToPaginate: Match[], page: number, itemsPerPage: number): Match[] => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return matchesToPaginate.slice(startIndex, endIndex);
  }, []);

  // =============================================
  // ACTIONS
  // =============================================
  
  const setFilters = useCallback((newFilters: Partial<MatchFilters>) => {
    setFiltersState(prev => {
      const updated = { ...prev, ...newFilters };
      saveToStorage(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const applyFilters = useCallback(() => {
    setIsLoadingPage(true);
    setError(null);
    
    try {
      // Apply filters
      let filtered = applyMatchFilters(matches, filters);
      
      // Apply sorting
      const sorted = applySorting(filtered, sortKey, sortDirection);
      
      // Apply pagination
      const paginated = applyPagination(sorted, currentPage, itemsPerPage);
      
      setFilteredMatches(paginated);
      
      // Store full filtered results for stats calculation
      // (we need this for accurate statistics)
      const fullFiltered = applySorting(applyMatchFilters(matches, filters), sortKey, sortDirection);
      
      // Reset to first page if current page is out of bounds
      const maxPage = Math.ceil(fullFiltered.length / itemsPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(1);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while filtering matches';
      setError(errorMessage);
      console.error('Filter application error:', err);
    } finally {
      setIsLoadingPage(false);
    }
  }, [matches, filters, sortKey, sortDirection, currentPage, itemsPerPage, applyMatchFilters, applySorting, applyPagination]);

  const resetFilters = useCallback(() => {
    const emptyFilters: MatchFilters = {};
    setFiltersState(emptyFilters);
    setCurrentPage(1);
    saveToStorage(STORAGE_KEY, emptyFilters);
  }, []);

  const setSorting = useCallback((key: SortKey, direction: SortDirection) => {
    setSortKey(key);
    setSortDirection(direction);
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const setItemsPerPageWrapper = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  }, []);

  const exportToCSV = useCallback(() => {
    try {
      const headers = [
        'Date',
        'Home Team',
        'Away Team',
        'Half Time',
        'Full Time',
        'BTTS',
        'Comeback'
      ];
      
      const csvRows = [
        headers.join(','),
        ...filteredMatches.map(match => [
          match.date,
          `"${match.home.name}"`,
          `"${match.away.name}"`,
          `${match.htScore.home}-${match.htScore.away}`,
          `${match.ftScore.home}-${match.ftScore.away}`,
          match.btts ? 'Yes' : 'No',
          match.comeback ? 'Yes' : 'No'
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `matches-export-${new Date().toISOString().slice(0, 10)}.csv`;
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export CSV';
      setError(errorMessage);
      console.error('CSV export error:', err);
    }
  }, [filteredMatches]);

  // =============================================
  // EFFECTS
  // =============================================
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [matches, filters, sortKey, sortDirection, currentPage, itemsPerPage]);

  // Update matches when initialMatches changes
  useEffect(() => {
    setMatches(initialMatches);
  }, [initialMatches]);

  // =============================================
  // RETURN VALUE
  // =============================================
  
  return {
    // Data
    matches,
    filteredMatches,
    stats,
    teams,
    
    // Loading states
    isLoading,
    isLoadingPage,
    error,
    
    // Filtering
    filters,
    setFilters,
    applyFilters,
    resetFilters,
    
    // Sorting
    sortKey,
    sortDirection,
    setSorting,
    
    // Pagination
    pagination,
    setPage,
    setItemsPerPage: setItemsPerPageWrapper,
    
    // Actions
    exportToCSV
  };
};

// =============================================
// PROVIDER COMPONENT
// =============================================

export const MatchDataProvider: React.FC<MatchDataProviderProps> = ({ 
  children, 
  initialMatches = [] 
}) => {
  const value = useMatchDataLogic(initialMatches);
  
  return React.createElement(MatchDataContext.Provider, { value }, children);
};

// =============================================
// HOOKS
// =============================================

// Context consumer hook
export const useMatchDataContext = (): MatchDataContextType => {
  const context = useContext(MatchDataContext);
  if (context === undefined) {
    throw new Error('useMatchDataContext must be used within a MatchDataProvider');
  }
  return context;
};

// Standalone hook (for backward compatibility and direct usage)
export const useMatchData = (initialMatches?: Match[]): UseMatchDataReturn => {
  // If called within a provider context, return the context value
  const context = useContext(MatchDataContext);
  if (context && initialMatches === undefined) {
    return context;
  }
  
  // Otherwise, return standalone hook logic
  return useMatchDataLogic(initialMatches || []);
};
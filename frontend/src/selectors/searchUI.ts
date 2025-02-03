import { MatchRule, SearchRule, TedTaggerState } from '../types';

export const getMatchRule = (state: TedTaggerState): MatchRule => {
  return state.searchUIState.matchRule;
};

export const getSearchRules = (state: TedTaggerState): SearchRule[] => {
  return state.searchUIState.searchRules;
};

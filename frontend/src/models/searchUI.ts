import { MatchRule, SearchRule, SearchUIState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------

export const SET_MATCH_RULE = 'SET_MATCH_RULE';
export const ADD_SEARCH_RULE = 'ADD_SEARCH_RULE';
export const UPDATE_SEARCH_RULE = 'UPDATE_SEARCH_RULE';
export const DELETE_SEARCH_RULE = 'DELETE_SEARCH_RULE';

// ------------------------------------
// Actions
// ------------------------------------

interface SetMatchRulePayload {
  matchRule: MatchRule,
}

export const setMatchRule = (matchRule: MatchRule): any => {
  return {
    type: SET_MATCH_RULE,
    payload: {
      matchRule,
    },
  };
};

interface AddSearchRulePayload {
  searchRule: SearchRule,
}

export const addSearchRule = (searchRule: SearchRule): any => {
  return {
    type: ADD_SEARCH_RULE,
    payload: {
      searchRule,
    },
  };
};

interface UpdateSearchRulePayload {
  searchRuleIndex: number,
  searchRule: SearchRule,
}

export const updateSearchRule = (searchRuleIndex: number, searchRule: SearchRule): any => {
  return {
    type: UPDATE_SEARCH_RULE,
    payload: {
      searchRuleIndex,
      searchRule,
    },
  };
};

interface DeleteSearchRulePayload {
  searchRuleIndex: number,
}

export const deleteSearchRule = (searchRuleIndex: number): any => {
  return {
    type: DELETE_SEARCH_RULE,
    payload: {
      searchRuleIndex,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: SearchUIState = {
  matchRule: MatchRule.all,
  searchRules: [],
};

export const searchUIStateReducer = (
  state: SearchUIState = initialState,
  action: TedTaggerModelBaseAction<SetMatchRulePayload & AddSearchRulePayload & UpdateSearchRulePayload & DeleteSearchRulePayload>
): SearchUIState => {
  switch (action.type) {
    case SET_MATCH_RULE:
      return {
        ...state,
        matchRule: action.payload.matchRule,
      };
    case ADD_SEARCH_RULE:
      return {
        ...state,
        searchRules: [
          ...state.searchRules,
          action.payload.searchRule,
        ],
      };
    case UPDATE_SEARCH_RULE:
      return {
        ...state,
        searchRules: [
          ...state.searchRules.slice(0, action.payload.searchRuleIndex),
          action.payload.searchRule,
          ...state.searchRules.slice(action.payload.searchRuleIndex + 1),
        ],
      };
    case DELETE_SEARCH_RULE:
      return {
        ...state,
        searchRules: [
          ...state.searchRules.slice(0, action.payload.searchRuleIndex),
          ...state.searchRules.slice(action.payload.searchRuleIndex + 1),
        ],
      };
    default:
      return state;
  }
};

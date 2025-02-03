import { cloneDeep } from 'lodash';
import { Keyword, KeywordNode, KeywordsState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';
import { getNodeByNodeId } from '../selectors';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_KEYWORD = 'ADD_KEYWORD';
export const ADD_KEYWORDS = 'ADD_KEYWORDS';
export const ADD_KEYWORD_NODE = 'ADD_KEYWORD_NODE';
export const ADD_KEYWORD_NODES = 'ADD_KEYWORD_NODES';
export const SET_KEYWORD_ROOT_NODE_ID = 'SET_KEYWORD_ROOT_NODE_ID';
export const CLEAR_KEYWORD_DATA = 'CLEAR_KEYWORD_DATA';

// ------------------------------------
// Actions
// ------------------------------------
interface AddKeywordsPayload {
  keywords: Keyword[],
}

export const addKeywordsRedux = (
  keywords: Keyword[],
): any => {
  return {
    type: ADD_KEYWORDS,
    payload: {
      keywords
    }
  };
};

interface AddKeywordPayload {
  keywordId: string,
  label: string,
  type: string,
}

export const addKeywordRedux = (
  keywordId: string,
  label: string,
  type: string,
): any => {
  return {
    type: ADD_KEYWORD,
    payload: {
      keywordId,
      label,
      type,
    }
  };
};

interface AddKeywordNodesPayload {
  keywordNodes: KeywordNode[],
}

export const addKeywordNodesRedux = (
  keywordNodes: KeywordNode[],
): any => {
  return {
    type: ADD_KEYWORD_NODES,
    payload: {
      keywordNodes
    }
  };
};


interface AddKeywordNodePayload {
  parentNodeId: string;
  keywordNode: KeywordNode;
}

export const addKeywordNodeRedux = (
  parentNodeId: string,
  keywordNode: KeywordNode,
): any => {
  return {
    type: ADD_KEYWORD_NODE,
    payload: {
      parentNodeId,
      keywordNode,
    }
  };
};

interface SetKeywordRootNodeIdPayload {
  keywordRootNodeId: string;
}

export const setKeywordRootNodeIdRedux = (
  keywordRootNodeId: string,
): any => {
  return {
    type: SET_KEYWORD_ROOT_NODE_ID,
    payload: {
      keywordRootNodeId
    }
  };
};

export const clearKeywordData = (
): any => {
  return {
    type: CLEAR_KEYWORD_DATA,
  };
};

function addChildNodeHelper(keywordsState: KeywordsState, parentNodeId: string, newNode: KeywordNode): void {

  const parentNode = getNodeByNodeId(keywordsState, parentNodeId);

  if (parentNode) {
    if (!parentNode.childrenNodeIds) {
      parentNode.childrenNodeIds = [];
    }

    newNode.parentNodeId = parentNodeId;
    parentNode.childrenNodeIds.push(newNode.nodeId);
  } else {
    debugger;
    console.error(`Parent node with id ${parentNodeId} not found.`);
  }
}


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: KeywordsState =
{
  keywordsById: {},
  keywordNodesByNodeId: {},
  keywordRootNodeId: '',
};

export const keywordsStateReducer = (
  state: KeywordsState = initialState,
  action: TedTaggerModelBaseAction<AddKeywordsPayload & AddKeywordNodesPayload & AddKeywordNodePayload & AddKeywordPayload & SetKeywordRootNodeIdPayload>
): KeywordsState => {
  switch (action.type) {
    case ADD_KEYWORDS: {
      const newState = cloneDeep(state);
      action.payload.keywords.forEach((keyword) => {
        newState.keywordsById[keyword.keywordId] = keyword;
      });
      return newState;
    }
    case ADD_KEYWORD:
      return {
        ...state,
        keywordsById: {
          ...state.keywordsById,
          [action.payload.keywordId]:
          {
            keywordId: action.payload.keywordId,
            label: action.payload.label,
            type: action.payload.type,
          }
        }
      };
    case ADD_KEYWORD_NODES: {
      const newState = cloneDeep(state);
      action.payload.keywordNodes.forEach((keywordNode) => {
        newState.keywordNodesByNodeId[keywordNode.nodeId] = keywordNode;
      });
      return newState;
    }
    case ADD_KEYWORD_NODE: {
      const newState = cloneDeep(state);
      addChildNodeHelper(newState, action.payload.parentNodeId, action.payload.keywordNode);
      const retState: KeywordsState = {
        ...newState,
        keywordNodesByNodeId: {
          ...newState.keywordNodesByNodeId,
          [action.payload.keywordNode.nodeId]: action.payload.keywordNode,
        }
      };
      return retState;
    }
    case SET_KEYWORD_ROOT_NODE_ID: {
      return {
        ...state,
        keywordRootNodeId: action.payload.keywordRootNodeId,
      };
    }
    case CLEAR_KEYWORD_DATA: {
      return initialState;
    }

    default:
      return state;
  }
};

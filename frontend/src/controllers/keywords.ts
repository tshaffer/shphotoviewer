import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import {
  TedTaggerAnyPromiseThunkAction,
  TedTaggerDispatch,
  addKeywordNodeRedux,
  addKeywordRedux,
  addKeywordNodesRedux,
  addKeywordsRedux,
  setKeywordRootNodeIdRedux,
  clearKeywordData,
} from '../models';
import { KeywordData, KeywordNode, StringToKeywordLUT, TedTaggerState, apiUrlFragment, serverUrl } from '../types';
import { getKeywordsById, getNodeByNodeId } from '../selectors';
import { cloneDeep, isNil } from 'lodash';

export const loadKeywordData = (): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    const path = serverUrl
      + apiUrlFragment
      + 'allKeywordData';

    return axios.get(path)
      .then((response: any) => {
        const keywordData: KeywordData = response.data;
        const { keywords, keywordNodes, keywordRootNodeId } = keywordData;
        dispatch(setKeywordRootNodeIdRedux(keywordRootNodeId));
        dispatch(addKeywordsRedux(keywords));
        dispatch(addKeywordNodesRedux(keywordNodes));
        return Promise.resolve();
      }).catch((error) => {
        console.log('error');
        console.log(error);
        return '';
      });
  };
};

export const mergeKeywordData = (keywordData: KeywordData): any => {
  return (dispatch: TedTaggerDispatch) => {
    const { keywords, keywordNodes } = keywordData;
    keywords.forEach((keyword: any) => {
      dispatch(addKeywordRedux(keyword.keywordId, keyword.label, keyword.type));
    });
    keywordNodes.forEach((keywordNode: any) => {
      dispatch(addKeywordNodeRedux(keywordNode.parentNodeId, keywordNode));
    });
  };
};

export const reloadKeywordData = (): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch) => {
    dispatch(clearKeywordData());
    return dispatch(loadKeywordData());
  };
};

export function addKeyword(parentNodeId: string, keywordLabel: string, keywordType: string): any {
  return (dispatch: TedTaggerDispatch, getState: any) => {

    // if a keyword with the same label and type already exists, get and use the existing keyword
    const keywords: StringToKeywordLUT = getKeywordsById(getState());

    // TEDTODO - add type to the search
    // const indexOfExistingKeyword: number = Object.values(keywords).findIndex((keyword: any) => keyword.label === keywordLabel && keyword.type === keywordType);
    const indexOfExistingKeyword: number = Object.values(keywords).findIndex((keyword: any) => keyword.label === keywordLabel);

    let keywordId: string;
    if (indexOfExistingKeyword >= 0) {
      keywordId = Object.keys(keywords)[indexOfExistingKeyword];
      dispatch(addKeywordNodeServerAndRedux(keywordId, parentNodeId));
    } else {
      keywordId = uuidv4();
      dispatch(addKeywordServerAndRedux(keywordId, keywordLabel, keywordType))
        .then(() => {
          dispatch(addKeywordNodeServerAndRedux(keywordId, parentNodeId));
        });
    }
  };
}

const addKeywordServerAndRedux = (keywordId: string, label: string, type: string): TedTaggerAnyPromiseThunkAction => {

  return (dispatch: TedTaggerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'addKeyword';

    const addKeywordBody = {
      keywordId,
      label,
      type,
    };

    return axios.post(
      path,
      addKeywordBody
    ).then((response) => {
      dispatch(addKeywordRedux(keywordId, label, type));
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
};

// if parent is not empty, add the keyword node to the parent
const addKeywordNodeServerAndRedux = (keywordId: string, parentNodeId: string): TedTaggerAnyPromiseThunkAction => {

  return (dispatch: TedTaggerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'addKeywordNode';

    const nodeId = uuidv4();

    const keywordNode: KeywordNode = {
      nodeId,
      keywordId,
      parentNodeId,
      childrenNodeIds: []
    };

    return axios.post(
      path,
      keywordNode,
    ).then((response) => {
      // update parent node with new child
      return dispatch(updateKeywordNodeServerAndRedux(keywordNode))
        .then(() => {
          return dispatch(addKeywordNodeRedux(parentNodeId, keywordNode));
        });
    });
  };
};

const updateKeywordNodeServerAndRedux = (childKeywordNode: KeywordNode): TedTaggerAnyPromiseThunkAction => {

  return (dispatch: TedTaggerDispatch, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'updateKeywordNode';

    const state: TedTaggerState = getState();

    if (isNil(childKeywordNode.parentNodeId) || childKeywordNode.parentNodeId === '') {
      return Promise.resolve();
    }

    const parentKeywordNode: KeywordNode | undefined = getNodeByNodeId(state.keywordsState, childKeywordNode.parentNodeId);
    if (isNil(parentKeywordNode)) {
      return Promise.resolve();
    }

    const existingChildrenNodeIds: string[] = parentKeywordNode.childrenNodeIds || [];
    const childrenNodeIds: string[] = cloneDeep(existingChildrenNodeIds);
    childrenNodeIds.push(childKeywordNode.nodeId);

    const updateKeywordNodeBody: KeywordNode = {
      nodeId: parentKeywordNode.nodeId,
      keywordId: parentKeywordNode.keywordId,
      parentNodeId: parentKeywordNode.parentNodeId,
      childrenNodeIds,
    };

    return axios.post(
      path,
      updateKeywordNodeBody,
    ).then((response) => {
      return Promise.resolve();
    });


  };
};

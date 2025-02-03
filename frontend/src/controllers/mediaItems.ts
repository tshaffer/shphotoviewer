import axios from 'axios';

import {
  TedTaggerAnyPromiseThunkAction,
  TedTaggerDispatch,
  addMediaItems,
  addKeywordToMediaItemIdsRedux,
  removeKeywordFromMediaItemIdsRedux,
  replaceMediaItemsRedux,
  deleteMediaItemsRedux,
  addDeletedMediaItems,
  removeDeletedMediaItemRedux,
  clearDeletedMediaItemsRedux,
  setDeletedMediaItems,
  setReviewLevelRedux
} from '../models';
import {
  serverUrl, apiUrlFragment, ServerMediaItem, MediaItem, TedTaggerState, MatchRule, SearchRule,
  ReviewLevel,
} from '../types';
import { cloneDeep, isEmpty, isNil, isString } from 'lodash';
import {
  getMatchRule,
  getMediaItemById,
  getSearchRules,
} from '../selectors';
import { deselectMediaItems } from './selectMediaItem';

export const loadMediaItems = (): any => {

  console.log('loadMediaItems entry');
  return (dispatch: TedTaggerDispatch) => {

    console.log('loadMediaItems inner');
    const specifyDateRange = false;
    const startDate = (new Date()).toISOString();
    const endDate = (new Date()).toISOString();

    let path = serverUrl
      + apiUrlFragment
      + 'mediaItemsToDisplay';

    path += '?specifyDateRange=' + specifyDateRange;
    path += '&startDate=' + startDate;
    path += '&endDate=' + endDate;

    path += '&specifyTagsInSearch=false&tagSelector=untagged&tagIds=&tagSearchOperator=OR';

    console.log('invoke axios.get on path', path);
    return axios.get(path)
      .then((mediaItemsResponse: any) => {

        console.log('mediaItemsResponse');
        console.log(mediaItemsResponse);

        const mediaItems: MediaItem[] = [];
        const mediaItemEntitiesFromServer: ServerMediaItem[] = (mediaItemsResponse as any).data;

        // derive mediaItems from serverMediaItems
        for (const mediaItemEntityFromServer of mediaItemEntitiesFromServer) {

          // TEDTODO - replace any
          const mediaItem: any = cloneDeep(mediaItemEntityFromServer);
          mediaItems.push(mediaItem as MediaItem);

        }
        console.log('dispatch addMediaItems');

        dispatch(addMediaItems(mediaItems));
      });
  };
};

const replaceMediaItems = (mediaItemsResponse: any): any => {
  return (dispatch: TedTaggerDispatch) => {
    console.log('mediaItemsResponse');
    console.log((mediaItemsResponse as any).data);
    const mediaItems: MediaItem[] = [];
    const mediaItemEntitiesFromServer: ServerMediaItem[] = (mediaItemsResponse as any).data;

    // derive mediaItems from serverMediaItems
    for (const mediaItemEntityFromServer of mediaItemEntitiesFromServer) {
      const mediaItem: MediaItem = cloneDeep(mediaItemEntityFromServer) as MediaItem;
      mediaItems.push(mediaItem as MediaItem);
    }

    dispatch(replaceMediaItemsRedux(mediaItems));
  };
}

export const loadMediaItemsByReviewLevels = (reviewLevels: ReviewLevel[]): TedTaggerAnyPromiseThunkAction => {

  return (dispatch: TedTaggerDispatch) => {

    console.log('loadMediaItemsByReviewLevels entry');
    console.log('reviewLevels');
    console.log(reviewLevels);

    let path = serverUrl
      + apiUrlFragment
      + 'mediaItemsByReviewLevels';

    path += '?reviewLevels=' + JSON.stringify(reviewLevels);

    return axios.get(path)
      .then((mediaItemsResponse: any) => {
        dispatch(replaceMediaItems(mediaItemsResponse));
      });
  };
};

export const loadMediaItemsFromSearchSpec = (): TedTaggerAnyPromiseThunkAction => {

  return (dispatch: TedTaggerDispatch, getState: any) => {

    const state: TedTaggerState = getState();

    const matchRule: MatchRule = getMatchRule(state);
    const searchRules: SearchRule[] = getSearchRules(state);

    let path = serverUrl
      + apiUrlFragment
      + 'mediaItemsToDisplayFromSearchSpec';

    path += '?matchRule=' + matchRule;
    path += '&searchRules=' + JSON.stringify(searchRules);

    return axios.get(path)
      .then((mediaItemsResponse: any) => {
        dispatch(replaceMediaItems(mediaItemsResponse));
      });
  };
};

export const updateKeywordAssignedToSelectedMediaItems = (
  keywordNodeId: string,
  selectedMediaItemIds: string[],
  assignKeyword: boolean
): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    if (assignKeyword) {
      dispatch(addKeywordToMediaItemIdsRedux(selectedMediaItemIds, keywordNodeId));
    } else {
      dispatch(removeKeywordFromMediaItemIdsRedux(selectedMediaItemIds, keywordNodeId));
    }
    return Promise.resolve();
  };
};

export const addKeywordToMediaItems = (
  mediaItemIds: string[],
  keywordNodeId: string,
): TedTaggerAnyPromiseThunkAction => {
  return (dispatch: TedTaggerDispatch, getState: any) => {

    // const path = serverUrl + apiUrlFragment + 'addKeywordToMediaItems';

    // const uniqueIds: string[] = mediaItems.map((mediaItem: MediaItem) => {
    //   return mediaItem.uniqueId;
    // });

    dispatch(addKeywordToMediaItemIdsRedux(mediaItemIds, keywordNodeId));
    return Promise.resolve();
    // const updateKeywordsInMediaItemsBody = {
    //   mediaItemIds: uniqueIds,
    //   tagId: keywordNode.id,
    // };

    // return axios.post(
    //   path,
    //   updateKeywordsInMediaItemsBody
    // ).then((response) => {
    //   dispatch(addTagToMediaItemsRedux(mediaItems, keywordNode.id));
    //   // return mediaItems.uniqueId;
    // }).catch((error) => {
    //   console.log('error');
    //   console.log(error);
    //   return '';
    // });
  };
};

export const deleteMediaItems = (mediaItemIds: string[]): any => {

  return (dispatch: TedTaggerDispatch, getState: any) => {

    const state = getState();

    const path = serverUrl + apiUrlFragment + 'deleteMediaItems';

    const deleteMediaItemsBody = { mediaItemIds };

    return axios.post(
      path,
      deleteMediaItemsBody
    ).then((response) => {
      dispatch(deselectMediaItems(mediaItemIds));
      dispatch(deleteMediaItemsRedux(mediaItemIds));

      // this is very suboptimal
      const deletedMediaItems: MediaItem[] = [];
      for (const mediaItemId of mediaItemIds) {
        const deletedMediaItem: MediaItem | null = getMediaItemById(state, mediaItemId);
        if (deletedMediaItem) {
          deletedMediaItems.push(deletedMediaItem);
        }
      }
      dispatch(addDeletedMediaItems(deletedMediaItems));

      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return Promise.reject();
    });
  };
};

export const loadDeletedMediaItems = (): TedTaggerAnyPromiseThunkAction => {

  return (dispatch: TedTaggerDispatch) => {

    const path = serverUrl
      + apiUrlFragment
      + 'deletedMediaItems';

    return axios.get(path)
      .then((deletedMediaItemsResponse: any) => {

        const deletedMediaItems: MediaItem[] = (deletedMediaItemsResponse as any).data;

        dispatch(setDeletedMediaItems(deletedMediaItems));

        return Promise.resolve();
      });
  };
};

export const clearDeletedMediaItems = (): any => {

  return (dispatch: any) => {

    const path = serverUrl + apiUrlFragment + 'clearDeletedMediaItems';

    return axios.post(
      path,
    ).then((response) => {
      dispatch(clearDeletedMediaItemsRedux());
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return Promise.reject();
    });
  };
};

export const removeDeletedMediaItem = (mediaItemId: string): any => {

  return (dispatch: TedTaggerDispatch) => {

    const path = serverUrl + apiUrlFragment + 'removeDeletedMediaItem';

    const removeDeletedMediaItemBody = { mediaItemId };

    return axios.post(
      path,
      removeDeletedMediaItemBody
    ).then((response) => {
      dispatch(removeDeletedMediaItemRedux(mediaItemId));
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return Promise.reject();
    });
  };
};

export const redownloadMediaItem = (mediaItemId: string): any => {

  return (dispatch: TedTaggerDispatch) => {

    const googleAccessToken: string = localStorage.getItem('googleAccessToken') as string;
    if (isNil(googleAccessToken) || !isString(googleAccessToken) || isEmpty(googleAccessToken)) {
      throw new Error('googleAccessToken is invalid');
    }

    const path = serverUrl + apiUrlFragment + 'redownloadMediaItem';

    const redownloadMediaItemBody = { id: mediaItemId, googleAccessToken };

    return axios.post(
      path,
      redownloadMediaItemBody
    ).then((response) => {
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return Promise.reject();
    });
  };
};

export const setReviewLevel = (mediaItemIds: string[], reviewLevel: ReviewLevel): any => {

  return (dispatch: TedTaggerDispatch) => {

    const path = serverUrl + apiUrlFragment + 'updateReviewLevel';

    const updateReviewLevelBody = { mediaItemIds, reviewLevel };

    return axios.post(
      path,
      updateReviewLevelBody
    ).then((response) => {
      dispatch(setReviewLevelRedux(mediaItemIds, reviewLevel));
      return Promise.resolve();
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return Promise.reject();
    });
  };
}

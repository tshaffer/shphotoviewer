import { cloneDeep, isNil } from 'lodash';

import { MediaItem, MediaItemsState, ReviewLevel } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const REPLACE_MEDIA_ITEMS = 'REPLACE_MEDIA_ITEMS';
export const ADD_MEDIA_ITEMS = 'ADD_MEDIA_ITEMS';
export const DELETE_MEDIA_ITEMS = 'DELETE_MEDIA_ITEMS';
export const ADD_KEYWORD_TO_MEDIA_ITEM_IDS = 'ADD_KEYWORD_TO_MEDIA_ITEM_IDS';
export const REMOVE_KEYWORD_FROM_MEDIA_ITEM_IDS = 'REMOVE_KEYWORD_FROM_MEDIA_ITEM_IDS';
export const ADD_KEYWORD_TO_MEDIA_ITEMS = 'ADD_KEYWORD_TO_MEDIA_ITEMS';

export const SET_LOUPE_VIEW_MEDIA_ITEM_IDS = 'SET_LOUPE_VIEW_MEDIA_ITEM_IDS';
export const REMOVE_LOUPE_VIEW_MEDIA_ITEM_ID = 'REMOVE_LOUPE_VIEW_MEDIA_ITEM_ID';

export const SET_DELETED_MEDIA_ITEMS = 'SET_DELETED_MEDIA_ITEMS';
export const ADD_DELETED_MEDIA_ITEMS = 'ADD_DELETED_MEDIA_ITEMS';
export const CLEAR_DELETED_MEDIA_ITEMS = 'CLEAR_DELETED_MEDIA_ITEMS';
export const REMOVE_DELETED_MEDIA_ITEM = 'REMOVE_DELETED_MEDIA_ITEM';

export const SET_REVIEW_LEVEL = 'SET_REVIEW_LEVEL';

// ------------------------------------
// Actions
// ------------------------------------

interface SetReviewLevelPayload {
  mediaItemIds: string[];
  reviewLevel: ReviewLevel;
}

export const setReviewLevelRedux = (
  mediaItemIds: string[],
  reviewLevel: ReviewLevel,
): any => {
  return {
    type: SET_REVIEW_LEVEL,
    payload: {
      mediaItemIds,
      reviewLevel
    }
  };
}

interface SetMediaItemsPayload {
  mediaItems: MediaItem[];
}

export const replaceMediaItemsRedux = (
  mediaItems: MediaItem[],
): any => {
  return {
    type: REPLACE_MEDIA_ITEMS,
    payload: {
      mediaItems
    }
  };
};


export const addMediaItems = (
  mediaItems: MediaItem[],
): any => {
  return {
    type: ADD_MEDIA_ITEMS,
    payload: {
      mediaItems
    }
  };
};

export const setDeletedMediaItems = (
  mediaItems: MediaItem[],
): any => {
  return {
    type: SET_DELETED_MEDIA_ITEMS,
    payload: {
      mediaItems
    }
  };
};

export const addDeletedMediaItems = (
  mediaItems: MediaItem[],
): any => {
  return {
    type: ADD_DELETED_MEDIA_ITEMS,
    payload: {
      mediaItems
    }
  };
};

interface DeleteMediaItemIdsPayload {
  mediaItemIds: string[];
}

export const deleteMediaItemsRedux = (
  mediaItemIds: string[],
) => {
  return {
    type: DELETE_MEDIA_ITEMS,
    payload: {
      mediaItemIds,
    }
  };
};

export const clearDeletedMediaItemsRedux = (
) => {
  return {
    type: CLEAR_DELETED_MEDIA_ITEMS,
  };
};

interface RemoveDeletedMediaItemIdPayload {
  mediaItemId: string;
}

export const removeDeletedMediaItemRedux = (
  mediaItemId: string,
) => {
  return {
    type: REMOVE_DELETED_MEDIA_ITEM,
    payload: {
      mediaItemId,
    }
  };
};

interface AddOrRemoveKeywordToMediaItemIdsPayload {
  mediaItemIds: string[];
  keywordNodeId: string;
}

export const addKeywordToMediaItemIdsRedux = (
  mediaItemIds: string[],
  keywordNodeId: string,
): any => {
  return {
    type: ADD_KEYWORD_TO_MEDIA_ITEM_IDS,
    payload: {
      mediaItemIds,
      keywordNodeId,
    }
  };
};

export const removeKeywordFromMediaItemIdsRedux = (
  mediaItemIds: string[],
  keywordNodeId: string,
): any => {
  return {
    type: REMOVE_KEYWORD_FROM_MEDIA_ITEM_IDS,
    payload: {
      mediaItemIds,
      keywordNodeId,
    }
  };
};


interface AddKeywordToMediaItemsPayload {
  mediaItem: MediaItem[];
  keywordNodeId: string;
}

export const addKeywordToMediaItemsRedux = (
  mediaItems: MediaItem[],
  keywordNodeId: string,
): any => {
  return {
    type: ADD_KEYWORD_TO_MEDIA_ITEMS,
    payload: {
      mediaItems,
      keywordNodeId,
    }
  };
};

interface SetLoupeViewMediaItemIdsPayload {
  mediaItemIds: string[];
}

export const setLoupeViewMediaItemIds = (
  mediaItemIds: string[],
): any => {
  return {
    type: SET_LOUPE_VIEW_MEDIA_ITEM_IDS,
    payload: {
      mediaItemIds
    }
  };
};

interface RemoveLoupViewMediaIdPayload {
  mediaItemId: string;
};

export const removeLoupeViewMediaItemId = (
  mediaItemId: string,
): any => {
  return {
    type: REMOVE_LOUPE_VIEW_MEDIA_ITEM_ID,
    payload: {
      mediaItemId
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: MediaItemsState =
{
  mediaItems: [],
  deletedMediaItems: [],
  loupeViewMediaItemIds: [],
};

export const mediaItemsStateReducer = (
  state: MediaItemsState = initialState,
  action: TedTaggerModelBaseAction<SetMediaItemsPayload & AddKeywordToMediaItemsPayload & AddOrRemoveKeywordToMediaItemIdsPayload & DeleteMediaItemIdsPayload & RemoveDeletedMediaItemIdPayload & SetLoupeViewMediaItemIdsPayload & RemoveLoupViewMediaIdPayload & SetReviewLevelPayload & SetReviewLevelPayload>
): MediaItemsState => {
  switch (action.type) {
    case REPLACE_MEDIA_ITEMS: {
      return {
        ...state,
        mediaItems: action.payload.mediaItems
      };
    }
    case ADD_MEDIA_ITEMS: {
      return {
        ...state,
        mediaItems: state.mediaItems.concat(action.payload.mediaItems)
      };
    }
    case SET_DELETED_MEDIA_ITEMS: {
      return {
        ...state,
        deletedMediaItems: action.payload.mediaItems
      };
    }
    case ADD_DELETED_MEDIA_ITEMS: {
      return {
        ...state,
        deletedMediaItems: state.deletedMediaItems.concat(action.payload.mediaItems)
      };
    }
    case CLEAR_DELETED_MEDIA_ITEMS: {
      return {
        ...state,
        deletedMediaItems: []
      };
    }
    case REMOVE_DELETED_MEDIA_ITEM: {
      let updatedDeletedMediaItems = cloneDeep(state.deletedMediaItems);
      updatedDeletedMediaItems = updatedDeletedMediaItems.filter(item => item.uniqueId !== action.payload.mediaItemId);
      return {
        ...state,
        deletedMediaItems: updatedDeletedMediaItems,
      };
    }
    case DELETE_MEDIA_ITEMS: {
      let updatedMediaItems = cloneDeep(state.mediaItems);
      updatedMediaItems = updatedMediaItems.filter(item => !(action.payload.mediaItemIds.includes(item.uniqueId)));
      return {
        ...state,
        mediaItems: updatedMediaItems,
      };
    }
    case ADD_KEYWORD_TO_MEDIA_ITEM_IDS: {
      const newState = cloneDeep(state) as MediaItemsState;

      // newState.mediaItems is all media items
      // action.payload.mediaItemIds is the media items that are selected

      // iterate through each media item
      newState.mediaItems.forEach((mediaItem) => {

        // is the current media item in the list of selected media items?
        const matchingInputItem = action.payload.mediaItemIds.find((inputItemId) => inputItemId === mediaItem.uniqueId);
        if (matchingInputItem) {
          // if yes, add the keyword to the media item's list of assigned keywords (if it doesn't already exist)
          if (isNil(mediaItem.keywordNodeIds)) {
            // mediaItem.keywordNodeIds may be undefined unless I regenerate the data (keywordNodeIds was added later)
            mediaItem.keywordNodeIds = [action.payload.keywordNodeId];
          } else {
            const keywordNodeIndex = mediaItem.keywordNodeIds.indexOf(action.payload.keywordNodeId);
            // only push if it's not already there
            if (keywordNodeIndex === -1) {
              mediaItem.keywordNodeIds.push(action.payload.keywordNodeId);
            }
          }
        }
      });
      return newState;
    }
    case REMOVE_KEYWORD_FROM_MEDIA_ITEM_IDS: {
      const newState = cloneDeep(state) as MediaItemsState;
      newState.mediaItems.forEach((mediaItem) => {
        const matchingInputItem = action.payload.mediaItemIds.find((inputItemId) => inputItemId === mediaItem.uniqueId);
        if (matchingInputItem) {
          if (!isNil(mediaItem.keywordNodeIds)) {
            const keywordNodeIndex = mediaItem.keywordNodeIds.indexOf(action.payload.keywordNodeId);
            if (keywordNodeIndex !== -1) {
              mediaItem.keywordNodeIds.splice(keywordNodeIndex, 1);
            }
          }
        }
      });
      return newState;
    }
    case ADD_KEYWORD_TO_MEDIA_ITEMS: {
      const newState = cloneDeep(state) as MediaItemsState;
      newState.mediaItems.forEach((item) => {
        const matchingInputItem = action.payload.mediaItems.find((inputItem) => inputItem.uniqueId === item.uniqueId);
        if (matchingInputItem) {
          const keywordNodeIndex = item.keywordNodeIds.indexOf(action.payload.keywordNodeId);
          if (keywordNodeIndex === -1) {
            item.keywordNodeIds.push(action.payload.keywordNodeId);
          }
        }
      });
      return newState;
    }
    case SET_LOUPE_VIEW_MEDIA_ITEM_IDS: {
      return {
        ...state,
        loupeViewMediaItemIds: action.payload.mediaItemIds
      };
    }
    case REMOVE_LOUPE_VIEW_MEDIA_ITEM_ID: {
      const loupeViewMediaItemIds: string[] = state.loupeViewMediaItemIds.filter(item => item !== action.payload.mediaItemId);
      return {
        ...state,
        loupeViewMediaItemIds,
      };
    }
    case SET_REVIEW_LEVEL: {
      const newState = cloneDeep(state) as MediaItemsState;
      newState.mediaItems.forEach((mediaItem) => {
        const matchingInputItem = action.payload.mediaItemIds.find((inputItemId) => inputItemId === mediaItem.uniqueId);
        if (matchingInputItem) {
          mediaItem.reviewLevel = action.payload.reviewLevel;
        }
      });
      return newState;
    }
    default:
      return state;
  }
};

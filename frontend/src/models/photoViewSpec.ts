import { PhotoLayout, PhotoViewSpec } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_PHOTO_LAYOUT = 'SET_PHOTO_LAYOUT';
export const SET_ZOOM_FACTOR = 'SET_ZOOM_FACTOR';
export const SET_LOUPE_VIEW_MEDIA_ITEM_ID = 'SET_LOUPE_VIEW_MEDIA_ITEM_ID';
export const SET_DISPLAY_METADATA = 'SET_DISPLAY_METADATA';
export const SET_SURVEY_MODE_ZOOM_FACTOR = 'SET_SURVEY_MODE_ZOOM_FACTOR';
export const SET_SCROLL_POSITION = 'SET_SCROLL_POSITION';
export const SET_FULL_SCREEN_MODE = 'SET_FULL_SCREEN_MODE';
export const SET_MEDIA_ITEM_ZOOM_FACTOR = 'SET_MEDIA_ITEM_ZOOM_FACTOR';

// ------------------------------------
// Actions
// ------------------------------------

interface SetPhotoLayoutPayload {
  photoLayout: PhotoLayout,
}

export const setPhotoLayoutRedux = (photoLayout: PhotoLayout): any => {
  return {
    type: SET_PHOTO_LAYOUT,
    payload: {
      photoLayout,
    },
  };
};

interface SetNumGridColumnsPayload {
  numGridColumns: number,
}

export const setNumGridColumnsRedux = (numGridColumns: number): any => {
  return {
    type: SET_ZOOM_FACTOR,
    payload: {
      numGridColumns,
    },
  };
};

interface SetLoupeViewMediaItemIdPayload {
  loupeViewMediaItemId: string,
}

export const setLoupeViewMediaItemIdRedux = (loupeViewMediaItemId: string): any => {
  return {
    type: SET_LOUPE_VIEW_MEDIA_ITEM_ID,
    payload: {
      loupeViewMediaItemId,
    },
  };
};

interface SetDisplayMetadata {
  displayMetadata: boolean,
}

export const setDisplayMetadata = (displayMetadata: boolean): any => {
  return {
    type: SET_DISPLAY_METADATA,
    payload: {
      displayMetadata,
    },
  };
};

interface SetSurveyModeZoomFactorPayload {
  surveyModeZoomFactor: number,
}

export const setSurveyModeZoomFactorRedux = (surveyModeZoomFactor: number): any => {
  return {
    type: SET_SURVEY_MODE_ZOOM_FACTOR,
    payload: {
      surveyModeZoomFactor,
    },
  };
};

interface SetScrollPositionPayload {
  scrollPosition: number,
}

export const setScrollPositionRedux = (scrollPosition: number): any => {
  return {
    type: SET_SCROLL_POSITION,
    payload: {
      scrollPosition,
    },
  };
};

interface SetFullScreenModePayload {
  fullScreenMode: boolean,
}

export const setFullScreenMode = (fullScreenMode: boolean): any => {
  return {
    type: SET_FULL_SCREEN_MODE,
    payload: {
      fullScreenMode,
    },
  };
};

interface SetMediaItemZoomFactorPayload {
  mediaItemId: string,
  zoomFactor: number,
}

export const setMediaItemZoomFactor = (mediaItemId: string, zoomFactor: number): any => {
  return {
    type: SET_MEDIA_ITEM_ZOOM_FACTOR,
    payload: {
      mediaItemId,
      zoomFactor,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: PhotoViewSpec = {
  photoLayout: PhotoLayout.Grid,
  numGridColumns: 3,
  loupeViewMediaItemId: '',
  displayMetadata: false,
  surveyModeZoomFactor: 1,
  scrollPosition: 0,
  fullScreenMode: false,
  mediaItemZoomFactorById: {},
};

export const photoViewSpecReducer = (
  state: PhotoViewSpec = initialState,
  action: TedTaggerModelBaseAction<SetPhotoLayoutPayload & SetNumGridColumnsPayload & SetSurveyModeZoomFactorPayload & SetLoupeViewMediaItemIdPayload & SetDisplayMetadata & SetScrollPositionPayload & SetFullScreenModePayload & SetMediaItemZoomFactorPayload>,
): PhotoViewSpec => {
  switch (action.type) {
    case SET_PHOTO_LAYOUT:
      return {
        ...state,
        photoLayout: action.payload.photoLayout,
      };
    case SET_ZOOM_FACTOR:
      return {
        ...state,
        numGridColumns: action.payload.numGridColumns,
      };
    case SET_LOUPE_VIEW_MEDIA_ITEM_ID:
      return {
        ...state,
        loupeViewMediaItemId: action.payload.loupeViewMediaItemId,
      };
    case SET_DISPLAY_METADATA:
      return {
        ...state,
        displayMetadata: action.payload.displayMetadata,
      };
    case SET_SURVEY_MODE_ZOOM_FACTOR:
      return {
        ...state,
        surveyModeZoomFactor: action.payload.surveyModeZoomFactor,
      };
    case SET_SCROLL_POSITION:
      return {
        ...state,
        scrollPosition: action.payload.scrollPosition,
      };
    case SET_FULL_SCREEN_MODE:
      return {
        ...state,
        fullScreenMode: action.payload.fullScreenMode,
      };
    case SET_MEDIA_ITEM_ZOOM_FACTOR:
      return {
        ...state,
        mediaItemZoomFactorById: {
          ...state.mediaItemZoomFactorById,
          [action.payload.mediaItemId]: action.payload.zoomFactor,
        },
      };
    default:
      return state;
  }
};

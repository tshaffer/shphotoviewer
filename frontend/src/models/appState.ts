import { AppState, MainDisplayMode } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_APP_INITIALIZED = 'SET_APP_INITIALIZED';
export const SET_MAIN_DISPLAY_MODE = 'SET_MAIN_DISPLAY_MODE';
export const SET_FULL_SCREEN_MEDIA_ITEM_ID = 'SET_FULL_SCREEN_MEDIA_ITEM_ID';
export const SET_GOOGLE_USER_PROFILE = 'SET_GOOGLE_USER_PROFILE';

// ------------------------------------
// Actions
// ------------------------------------

export const setAppInitialized = (): any => {
  return {
    type: SET_APP_INITIALIZED,
  };
};

export const setMainDisplayMode = (mainDisplayMode: MainDisplayMode): any => {
  return {
    type: SET_MAIN_DISPLAY_MODE,
    payload: mainDisplayMode,
  };
};

export const setFullScreenMediaItemId = (mediaItemId: string): any => {
  return {
    type: SET_FULL_SCREEN_MEDIA_ITEM_ID,
    payload: mediaItemId,
  };
};

export const setGoogleUserProfile = (googleUserProfile: any): any => {
  return {
    type: SET_GOOGLE_USER_PROFILE,
    payload: googleUserProfile,
  };
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AppState = {
  appInitialized: false,
  mainDisplayMode: MainDisplayMode.Grid,
  fullScreenMediaItemId: '',
  googleUserProfile: null,
};

export const appStateReducer = (
  state: AppState = initialState,
  action: TedTaggerModelBaseAction<any>
): AppState => {
  switch (action.type) {
    case SET_APP_INITIALIZED: {
      return { ...state, appInitialized: true };
    }
    case SET_MAIN_DISPLAY_MODE: {
      return { ...state, mainDisplayMode: action.payload };
    }
    case SET_FULL_SCREEN_MEDIA_ITEM_ID: {
      return {
        ...state,
        mainDisplayMode: MainDisplayMode.FullScreen,
        fullScreenMediaItemId: action.payload
      };
    }
    case SET_GOOGLE_USER_PROFILE: {
      return { ...state, googleUserProfile: action.payload };
    }
    default:
      return state;
  }
};

import { MainDisplayMode, TedTaggerState } from '../types';

export const getAppInitialized = (state: TedTaggerState): boolean => {
  return state.appState.appInitialized;
};

export const getMainDisplayMode = (state: TedTaggerState): MainDisplayMode => {
  return state.appState.mainDisplayMode;
}; 

export const getFullScreenMediaItemId = (state: TedTaggerState): string => {
  return state.appState.fullScreenMediaItemId;
};

export const getGoogleUserProfile = (state: TedTaggerState): any => {
  return state.appState.googleUserProfile;
};
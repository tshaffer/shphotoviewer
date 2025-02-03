import { TedTaggerState, PhotoViewSpec, PhotoLayout } from '../types';

export const getPhotoViewSpec = (state: TedTaggerState): PhotoViewSpec => {
  return state.photoViewSpec;
};

export const getPhotoLayout = (state: TedTaggerState): PhotoLayout => {
  return state.photoViewSpec.photoLayout;
};

export const getNumGridColumns = (state: TedTaggerState): number => {
  return state.photoViewSpec.numGridColumns;
};

export const getLoupeViewMediaItemId = (state: TedTaggerState): string => {
  return state.photoViewSpec.loupeViewMediaItemId;
};

export const getDisplayMetadata = (state: TedTaggerState): boolean => {
  return state.photoViewSpec.displayMetadata;
};

export const getSurveyModeZoomFactor = (state: TedTaggerState): number => {
  return state.photoViewSpec.surveyModeZoomFactor;
};

export const getScrollPosition = (state: TedTaggerState): number => {
  return state.photoViewSpec.scrollPosition;
};

export const getFullScreenMode = (state: TedTaggerState): boolean => {
  return state.photoViewSpec.fullScreenMode;
};

export const getMediaItemZoomFactor = (state: TedTaggerState, mediaItemId: string): number => {
  return state.photoViewSpec.mediaItemZoomFactorById[mediaItemId] || 1;
};

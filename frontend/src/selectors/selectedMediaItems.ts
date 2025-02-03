import {
  MediaItem,
  TedTaggerState
} from '../types';

import { getMediaItemById } from './mediaItems';

export const getSelectedMediaItemIds = (state: TedTaggerState): string[] => {
  return state.selectionsState.selectedMediaItemIds;
};

export const getSelectedMediaItems = (state: TedTaggerState): MediaItem[] => {
  const selectedMediaItemIds: string[] = getSelectedMediaItemIds(state);
  const selectedMediaItems: MediaItem[] = [];
  for (const selectedMediaItemId of selectedMediaItemIds) {
    const selectedMediaItem = getMediaItemById(state, selectedMediaItemId);
    if (selectedMediaItem) {
      selectedMediaItems.push(selectedMediaItem);
    }
  }
  return selectedMediaItems;
};

export const isMediaItemSelected = (state: TedTaggerState, mediaItem: MediaItem): boolean => {

  const selectedMediaItemIds: string[] = getSelectedMediaItemIds(state);
  for (const selectedMediaItemId of selectedMediaItemIds) {
    const selectedMediaItem = getMediaItemById(state, selectedMediaItemId);
    if (selectedMediaItem?.uniqueId === mediaItem?.uniqueId) {
      return true;
    }
  }

  return false;
};

export const getLastClickedId = (state: TedTaggerState): string | null => {
  return state.selectionsState.lastClickedId;
};

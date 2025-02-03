import {
  MediaItem,
  TedTaggerState
} from '../types';

export const getMediaItems = (state: TedTaggerState): MediaItem[] => {
  return state.mediaItemsState.mediaItems;
};

export const getMediaItemIds = (state: TedTaggerState): string[] => {
  return state.mediaItemsState.mediaItems.map((mediaItem: MediaItem) => mediaItem.uniqueId);
};

export const getMediaItemById = (state: TedTaggerState, uniqueId: string): MediaItem | null => {

  for (const mediaItem of state.mediaItemsState.mediaItems) {
    if (mediaItem.uniqueId === uniqueId) {
      return mediaItem;
    }
  }

  return null;
};

export const getDeletedMediaItems = (state: TedTaggerState): MediaItem[] => {
  return state.mediaItemsState.deletedMediaItems;
};

export const getLoupeViewMediaItemIds = (state: TedTaggerState): string[] => {
  return state.mediaItemsState.loupeViewMediaItemIds;
};

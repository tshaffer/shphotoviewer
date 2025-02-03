import { TedTaggerDispatch, setPhotoLayoutRedux } from '../models';
import { getSelectedMediaItemIds } from '../selectors';
import { PhotoLayout, TedTaggerState } from '../types';
import { deleteMediaItems } from './mediaItems';

export const deleteSurveyViewImageContainerItem = (mediaItemId: string) => {
  return (dispatch: TedTaggerDispatch, getState: any) => {
    dispatch(
      deleteMediaItems([mediaItemId])).then(() => {
        const state: TedTaggerState = getState();
        const selectedMediaItemIds: string[] = getSelectedMediaItemIds(state);
        if (selectedMediaItemIds.length < 2) {
          dispatch(setPhotoLayoutRedux(PhotoLayout.Grid));
        }
      });
  };
};

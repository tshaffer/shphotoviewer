import * as React from 'react';
import { connect } from 'react-redux';

import { MediaItem } from '../types';
import LoupeView from './LoupeView';
import { getLoupeViewMediaItemId, getLoupeViewMediaItemIds, getMediaItems, getSelectedMediaItemIds } from '../selectors';
import { bindActionCreators } from 'redux';
import { TedTaggerDispatch, setFullScreenMode, setLoupeViewMediaItemIdRedux } from '../models';
import { deselectAllPhotos, selectPhoto } from '../controllers';

export interface LoupeViewControllerProps {
  loupeViewMediaItemId: string;
  loupeViewMediaItemIds: string[];
  mediaItems: MediaItem[];
  selectedMediaItemIds: string[],
  onSetLoupeViewMediaItemId: (id: string) => any;
  onSelectPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => any;
  onDeselectAllPhotos: () => any;
  onSetFullScreenMode: (fullScreenMode: boolean) => any;
}

const LoupeViewController = (props: LoupeViewControllerProps) => {

  React.useEffect(() => {

    console.log('LoupeViewController: React.useEffect - invoked');

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          handleDisplayNextPhoto();
          break;
        case 'ArrowLeft':
          handleDisplayPreviousPhoto();
          break;
        default:
          break;
      }
    };

    const handleDisplayPreviousPhoto = () => {

      const loupeViewMediaItemId = props.loupeViewMediaItemId;

      const loupeViewMediaItemIndex = props.loupeViewMediaItemIds.indexOf(loupeViewMediaItemId);
      if (loupeViewMediaItemIndex < 0) {
        debugger;
      }

      const previousMediaItemIndex = loupeViewMediaItemIndex - 1;
      if (previousMediaItemIndex < 0) {
        return;
      } else {
        const previousMediaItemId: string = props.loupeViewMediaItemIds[previousMediaItemIndex];
        const previousMediaItem = props.mediaItems.find((mediaItem: MediaItem) => mediaItem.uniqueId === previousMediaItemId);
        props.onSetLoupeViewMediaItemId(previousMediaItem!.uniqueId);
        if (props.selectedMediaItemIds.length === 1) {
          props.onDeselectAllPhotos(); // only perform the deselect if there's only a single selected item.
          props.onSelectPhoto(previousMediaItem!.uniqueId, false, false);
        }
      }
    };

    const handleDisplayNextPhoto = () => {

      const loupeViewMediaItemId = props.loupeViewMediaItemId;

      const loupeViewMediaItemIndex = props.loupeViewMediaItemIds.indexOf(loupeViewMediaItemId);
      if (loupeViewMediaItemIndex < 0) {
        debugger;
      }

      const nextMediaItemIndex = loupeViewMediaItemIndex + 1;
      if (nextMediaItemIndex >= props.loupeViewMediaItemIds.length) {
        console.log('at end');
        return;
      } else {
        const nextMediaItemId: string = props.loupeViewMediaItemIds[nextMediaItemIndex];
        const nextMediaItem = props.mediaItems.find((mediaItem: MediaItem) => mediaItem.uniqueId === nextMediaItemId);
        console.log('nextMediaItem: ' + nextMediaItem);
        props.onSetLoupeViewMediaItemId(nextMediaItem!.uniqueId);
        if (props.selectedMediaItemIds.length === 1) {
          props.onDeselectAllPhotos(); // only perform the deselect if there's only a single selected item.
          props.onSelectPhoto(nextMediaItem!.uniqueId, false, false);
        }
      }
    };

    const handleFullScreenChange = () => {
      const enterFullScreenMode = document.fullscreenElement !== null;
      props.onSetFullScreenMode(enterFullScreenMode);
    };

    document.addEventListener('keydown', handleKeyPress);

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    // Remove the event listener when the component unmounts
    return () => {
      console.log('LoupeViewController: React.useEffect - component unmounts');
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [props.loupeViewMediaItemId]);

  return (
    <LoupeView />
  );
};

function mapStateToProps(state: any) {
  return {
    loupeViewMediaItemId: getLoupeViewMediaItemId(state),
    loupeViewMediaItemIds: getLoupeViewMediaItemIds(state),
    mediaItems: getMediaItems(state),
    selectedMediaItemIds: getSelectedMediaItemIds(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetLoupeViewMediaItemId: setLoupeViewMediaItemIdRedux,
    onSelectPhoto: selectPhoto,
    onDeselectAllPhotos: deselectAllPhotos,
    onSetFullScreenMode: setFullScreenMode
  }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(LoupeViewController);

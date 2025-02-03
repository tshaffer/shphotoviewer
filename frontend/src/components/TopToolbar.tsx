import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../styles/TedTagger.css';
import { IconButton, Slider, Typography } from '@mui/material';
import { TedTaggerDispatch, removeLoupeViewMediaItemId, setDisplayMetadata, setLoupeViewMediaItemIdRedux, setLoupeViewMediaItemIds, setNumGridColumnsRedux, setPhotoLayoutRedux, setScrollPositionRedux, setSurveyModeZoomFactorRedux } from '../models';
import { Tooltip } from '@mui/material';

import GridOnIcon from '@mui/icons-material/GridOn';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CompareIcon from '@mui/icons-material/Compare';
import InfoIcon from '@mui/icons-material/Info';
import DeselectIcon from '@mui/icons-material/Deselect';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

import { GoogleUserProfile, MediaItem, PhotoLayout, ReviewLevel } from '../types';
import { getSelectedMediaItemIds, getMediaItems, getNumGridColumns, getPhotoLayout, getDisplayMetadata, getSurveyModeZoomFactor, getDeletedMediaItems, getLoupeViewMediaItemIds, getMediaItemIds, getSelectedMediaItems, getLoupeViewMediaItemId, getGoogleUserProfile } from '../selectors';
import { deleteMediaItems, deselectAllPhotos, redownloadMediaItem, selectPhoto, setReviewLevel } from '../controllers';
import { sliderContainerXTranslate } from '../constants';

export interface TopToolbarProps {
  mediaItems: MediaItem[];
  mediaItemIds: string[];
  selectedMediaItems: MediaItem[];
  selectedMediaItemIds: string[];
  googleUserProfile: GoogleUserProfile | null;
  loupeViewMediaItemId: string;
  loupeViewMediaItemIds: string[];
  numGridColumns: number;
  surveyModeZoomFactor: number;
  photoLayout: PhotoLayout;
  displayMetadata: boolean;
  deletedMediaItems: MediaItem[];
  onSetNumGridColumns: (numGridColumns: number) => void;
  onSetSurveyModeZoomFactor: (numGridColumns: number) => void;
  onSetPhotoLayout: (photoLayout: PhotoLayout) => void;
  onSetLoupeViewMediaItemId: (id: string) => any;
  onSetDisplayMetadata: (displayMetadata: boolean) => any;
  onSetScrollPosition: (scrollPosition: number) => any;
  onDeleteMediaItems: (mediaItemIds: string[]) => any;
  onRedownloadMediaItem: (mediaItemId: string) => any;
  onDeselectAllPhotos: () => void;
  onSelectPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => any;
  onSetLoupeViewMediaItemIds: (mediaItemIds: string[]) => any;
  onRemoveLoupeViewMediaItemId: (mediaItemId: string) => any;
  onSetReviewsLevel: (mediaItemIds: string[], reviewLevel: ReviewLevel) => any;
}

const TopToolbar = (props: TopToolbarProps) => {

  function handleSliderChange(event: Event, value: number | number[]): void {
    props.onSetNumGridColumns(value as number);
  }

  function handleSurveyModeZoomFactorChange(event: Event, value: number | number[], activeThumb: number): void {
    props.onSetSurveyModeZoomFactor(value as number);
  }

  function handleUpdatePhotoLayout(photoLayout: PhotoLayout): void {

    // return if the photo layout is already set to the requested layout.
    if (photoLayout === props.photoLayout) {
      return;
    }

    // capture the scroll position if transitioning out of Grid layout.
    if (props.photoLayout === PhotoLayout.Grid && photoLayout !== PhotoLayout.Grid) {
      const divElement = document.getElementById('centerColumn') as HTMLDivElement | null;
      if (divElement) {
        const scrollPosition: number = divElement.scrollTop;
        props.onSetScrollPosition(scrollPosition);
      }
    }

    // transition to new layout
    if (photoLayout === PhotoLayout.Loupe) {

      // set loupeViewMediaItemId and loupeViewMediaItemIds based on current selection state
      if (props.selectedMediaItemIds.length === 0) {    // not a real scenario but just in case.
        props.onSetLoupeViewMediaItemId(props.mediaItemIds[0]);
        props.onSetLoupeViewMediaItemIds(props.mediaItemIds);
      } else if (props.selectedMediaItemIds.length === 1) {
        props.onSetLoupeViewMediaItemId(props.selectedMediaItemIds[0]);
        props.onSetLoupeViewMediaItemIds(props.mediaItemIds);
      } else {
        props.onSetLoupeViewMediaItemId(props.selectedMediaItemIds[0]);
        props.onSetLoupeViewMediaItemIds(props.selectedMediaItemIds);
      }

      props.onSetPhotoLayout(PhotoLayout.Loupe);

    } else {
      props.onSetPhotoLayout(photoLayout);
    }
  }

  const handleEnterFullScreenMode = () => {
    const elem = document.getElementById('loupeViewImage');
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  };

  function handleDeselectAll(): void {
    props.onDeselectAllPhotos();
  }

  function handlaToggleDisplayMetadata(): void {
    props.onSetDisplayMetadata(!props.displayMetadata);
  }

  const deleteLoupeViewMediaItem = () => {

    const loupeViewMediaItemId = props.loupeViewMediaItemId;

    const loupeViewMediaItemIndex = props.loupeViewMediaItemIds.indexOf(loupeViewMediaItemId);
    if (loupeViewMediaItemIndex < 0) {
      debugger;
    }

    // handle the case where there is only one media item in the loupe view.
    if (props.loupeViewMediaItemIds.length === 1) {
      debugger;
    }

    let newLoupeViewMediaItemIndex = -1;
    const prevLoupeViewMediaItemIndex = loupeViewMediaItemIndex - 1;
    const nextLoupeViewMediaItemIndex = loupeViewMediaItemIndex + 1;
    if (nextLoupeViewMediaItemIndex < props.loupeViewMediaItemIds.length) {
      newLoupeViewMediaItemIndex = nextLoupeViewMediaItemIndex;
    } else if (prevLoupeViewMediaItemIndex >= 0) {
      newLoupeViewMediaItemIndex = prevLoupeViewMediaItemIndex;
    } else {
      debugger;
    }

    const newLoupeViewMediaItemId = props.loupeViewMediaItemIds[newLoupeViewMediaItemIndex];

    props.onDeleteMediaItems([props.loupeViewMediaItemId]);
    props.onRemoveLoupeViewMediaItemId(props.loupeViewMediaItemId);
    props.onSetLoupeViewMediaItemId(newLoupeViewMediaItemId);

  };

  const getPhotoLayoutPropsUI = (): JSX.Element | null => {
    switch (props.photoLayout) {
      case PhotoLayout.Survey: {
        return (
          <div style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(' + sliderContainerXTranslate.toString() + '%, -50%)',
          }}>
            <div className='sliderContainer'>
              <Typography gutterBottom style={{ fontSize: '13px' }}>Zoom</Typography>
              <Slider
                size='small'
                value={props.surveyModeZoomFactor}
                onChange={handleSurveyModeZoomFactorChange}
                valueLabelDisplay='auto'
                min={1}
                step={0.1}
                max={6}
              />
            </div>
          </div>
        );
      }
      case PhotoLayout.Grid: {
        return (
          <div style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(' + sliderContainerXTranslate.toString() + '%, -50%)',
          }}>
            <div className='sliderContainer'> {/* sliderContainer wrapped inside the parent */}
              <Typography gutterBottom style={{ fontSize: '13px' }}>Zoom</Typography>
              <Slider
                size='small'
                value={props.numGridColumns}
                onChange={handleSliderChange}
                valueLabelDisplay='auto'
                step={1}
                marks
                min={2}
                max={10}
              />
            </div>
          </div>

        );
      }
    }

    return null;
  };

  const renderUserProfile = (): JSX.Element => {
    if (props.googleUserProfile) {
      return (
        <span>{props.googleUserProfile.name}</span>
      );
    } else {
      return (
        <span>Not signed in</span>
      );
    }
  }

  return (
    <React.Fragment>
      <div className='toolbarIconButtonContainer'>
        <div>
          <Tooltip title="Grid">
            <IconButton
              onClick={() => {
                handleUpdatePhotoLayout(PhotoLayout.Grid);
              }}>
              <GridOnIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Loupe">
            <span>
              <IconButton
                disabled={props.selectedMediaItemIds.length === 0}
                onClick={() => {
                  handleUpdatePhotoLayout(PhotoLayout.Loupe);
                }}>
                <InsertPhotoIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Full screen">
            <span>
              <IconButton
                disabled={props.photoLayout !== PhotoLayout.Loupe}
                onClick={() => {
                  handleEnterFullScreenMode();
                }}>
                <FullscreenIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Survey">
            <span>
              <IconButton
                disabled={props.selectedMediaItemIds.length < 2}
                onClick={() => {
                  handleUpdatePhotoLayout(PhotoLayout.Survey);
                }}>
                <CompareIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Deselect All">
            <span>
              <IconButton
                disabled={props.selectedMediaItemIds.length === 0 || props.photoLayout !== PhotoLayout.Grid}
                onClick={() => {
                  handleDeselectAll();
                }}
              >
                <DeselectIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Metadata">
            <IconButton
              onClick={() => {
                handlaToggleDisplayMetadata();
              }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
          {getPhotoLayoutPropsUI()}
        </div>
        <div style={{ paddingRight: '10px' }}>
          {renderUserProfile()}
        </div>
      </div>

    </React.Fragment>
  );
};

function mapStateToProps(state: any) {

  return {
    mediaItems: getMediaItems(state),
    mediaItemIds: getMediaItemIds(state),
    selectedMediaItemIds: getSelectedMediaItemIds(state),
    selectedMediaItems: getSelectedMediaItems(state),
    loupeViewMediaItemId: getLoupeViewMediaItemId(state),
    loupeViewMediaItemIds: getLoupeViewMediaItemIds(state),
    numGridColumns: getNumGridColumns(state),
    surveyModeZoomFactor: getSurveyModeZoomFactor(state),
    photoLayout: getPhotoLayout(state),
    displayMetadata: getDisplayMetadata(state),
    deletedMediaItems: getDeletedMediaItems(state),
    googleUserProfile: getGoogleUserProfile(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetPhotoLayout: setPhotoLayoutRedux,
    onSetLoupeViewMediaItemId: setLoupeViewMediaItemIdRedux,
    onSetNumGridColumns: setNumGridColumnsRedux,
    onSetDisplayMetadata: setDisplayMetadata,
    onSetSurveyModeZoomFactor: setSurveyModeZoomFactorRedux,
    onSetScrollPosition: setScrollPositionRedux,
    onDeleteMediaItems: deleteMediaItems,
    onRedownloadMediaItem: redownloadMediaItem,
    onDeselectAllPhotos: deselectAllPhotos,
    onSelectPhoto: selectPhoto,
    onSetLoupeViewMediaItemIds: setLoupeViewMediaItemIds,
    onRemoveLoupeViewMediaItemId: removeLoupeViewMediaItemId,
    onSetReviewsLevel: setReviewLevel,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TopToolbar);


import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CardMedia, IconButton } from '@mui/material';

import { TedTaggerDispatch, setMediaItemZoomFactor } from '../models';
import { MediaItem } from '../types';

import { getPhotoUrl } from '../utilities';
import SurveyViewImage from './SurveyViewImage';
import { getMediaItemZoomFactor, getSurveyModeZoomFactor } from '../selectors';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { surveyRowHeights } from '../constants';

const cardMediaStyle = {
  objectFit: 'contain',
  height: '1080px',
  backgroundColor: 'purple',
};

export interface SurveyViewImageContainerPropsFromParent {
  mediaItem: MediaItem;
  numGridColumns: number;
  numGridRows: number;
}

export interface SurveyViewImageContainerProps extends SurveyViewImageContainerPropsFromParent {
  surveyModeZoomFactor: number;
  mediaItemZoomFactor: number;
  onSetMediaItemZoomFactor: (mediaItemId: string, zoomFactor: number) => any;
}

function SurveyViewImageContainer(props: SurveyViewImageContainerProps) {

  const handleSurveyViewImageZoomIn = () => {
    props.onSetMediaItemZoomFactor(props.mediaItem.uniqueId, props.mediaItemZoomFactor + 0.2);
  };

  const handleSurveyViewImageZoomOut = () => {
    props.onSetMediaItemZoomFactor(props.mediaItem.uniqueId, props.mediaItemZoomFactor - 0.2);
  };

  const photoUrl = getPhotoUrl(props.mediaItem);

  const cardMediaHeight: number = surveyRowHeights[props.numGridRows - 1];
  cardMediaStyle.height = cardMediaHeight.toString() + 'px';

  return (
    <React.Fragment>
      <CardMedia
        id={props.mediaItem.uniqueId}
        className='survey-image-container'
        title={photoUrl}
        sx={cardMediaStyle}
      >
        <div>
          <SurveyViewImage
            mediaItem={props.mediaItem}
          />
          <div
            className='overlayIconStyle'>
            <IconButton
              onClick={() => {
                handleSurveyViewImageZoomIn();
              }}>
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                handleSurveyViewImageZoomOut();
              }}>
              <RemoveIcon />
            </IconButton>
          </div>
        </div>
      </CardMedia>
    </React.Fragment>
  );
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    mediaItem: ownProps.mediaItem,
    surveyModeZoomFactor: getSurveyModeZoomFactor(state),
    mediaItemZoomFactor: getMediaItemZoomFactor(state, ownProps.mediaItem.uniqueId),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetMediaItemZoomFactor: setMediaItemZoomFactor,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyViewImageContainer);

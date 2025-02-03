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
  onSetMediaItemZoomFactor: (mediaItemId: string, zoomFactor: number) => void;
}

function SurveyViewImageContainer(props: SurveyViewImageContainerProps) {
  const handleSurveyViewImageZoomIn = () => {
    props.onSetMediaItemZoomFactor(props.mediaItem.uniqueId, props.mediaItemZoomFactor + 0.2);
  };

  const handleSurveyViewImageZoomOut = () => {
    props.onSetMediaItemZoomFactor(props.mediaItem.uniqueId, props.mediaItemZoomFactor - 0.2);
  };

  const photoUrl = getPhotoUrl(props.mediaItem);
  const zoomFactor = props.surveyModeZoomFactor * props.mediaItemZoomFactor; // Compute zoom factor here

  const cardMediaHeight: number = surveyRowHeights[props.numGridRows - 1];

  return (
    <React.Fragment>
      <CardMedia
        id={props.mediaItem.uniqueId}
        className='survey-image-container'
        title={photoUrl}
        sx={{ ...cardMediaStyle, height: `${cardMediaHeight}px` }}
      >
        <div>
          {/* ✅ Pass computed zoomFactor */}
          <SurveyViewImage mediaItem={props.mediaItem} zoomFactor={zoomFactor} />
          <div className='overlayIconStyle'>
            <IconButton onClick={handleSurveyViewImageZoomIn}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={handleSurveyViewImageZoomOut}>
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

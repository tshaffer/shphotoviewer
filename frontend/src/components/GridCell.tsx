import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/*
  Unreviewed:     VisibilityOffIcon = 'unreviewed',
  ReadyForReview: GradingIcon = 'readyForReview',
  UploadIcon:     ReadyForUpload = 'readyForUpload',
  CloudQueueIcon: UploadedToGoogle = 'uploadedToGoogle',
*/
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GradingIcon from '@mui/icons-material/Grading';
import UploadIcon from '@mui/icons-material/Upload';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux, setPhotoLayoutRedux } from '../models';

import '../styles/TedTagger.css';
import { MediaItem, PhotoLayout } from '../types';
import { getKeywordLabelsForMediaItem, getMediaItems, isMediaItemSelected } from '../selectors';
import { getPhotoUrl } from '../utilities';
import { Tooltip, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { selectPhoto } from '../controllers';
import { borderSizeStr } from '../constants';

export interface GridCellPropsFromParent {
  mediaItemIndex: number;
  mediaItem: MediaItem
  rowHeight: number;
  cellWidth: number;
}

export interface GridCellProps extends GridCellPropsFromParent {
  isSelected: boolean;
  keywordLabels: string[];
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => any;
  onSetLoupeViewMediaItemId: (id: string) => any;
  onSetPhotoLayoutRedux: (photoLayout: PhotoLayout) => any;
}

// const softGray = 'rgba(255, 255, 255, 0.8)';
const mutedWhite = 'rgba(255, 255, 255, 0.9)';
// const softBlack = 'rgba(0, 0, 0, 0.6)';
// const lightBlue = '#80D8FF';
// const mutedYellow = '#FFD54F';
// const desaturatedGreen = '#A5D6A7';
// const transparentAccent = 'rgba(255, 87, 34, 0.7)';

const reviewLevelIconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  fontSize: '20px',
  color: mutedWhite,
};

const GridCell = (props: GridCellProps) => {

  const [clickTimeout, setClickTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const mediaItem: MediaItem = props.mediaItem;

  const photoUrl = getPhotoUrl(mediaItem);

  const renderReviewLevelIcon = (): JSX.Element => {
    switch (props.mediaItem.reviewLevel) {
      case 'unreviewed':
      default:
        return <VisibilityOffIcon style={reviewLevelIconStyle} />;
      case 'readyForReview':
        return <GradingIcon style={reviewLevelIconStyle} />;
      case 'readyForUpload':
        return <UploadIcon style={reviewLevelIconStyle} />;
      case 'uploadedToGoogle':
        return <CloudQueueIcon style={reviewLevelIconStyle} />;
    }
  }

  const handleDoubleClick = () => {
    props.onSetLoupeViewMediaItemId(props.mediaItem.uniqueId);
    props.onSetPhotoLayoutRedux(PhotoLayout.Loupe);
  };

  const handleClickPhoto = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    props.onClickPhoto(props.mediaItem.uniqueId, e.metaKey, e.shiftKey);
  };

  const handleClicks = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (clickTimeout !== null) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleDoubleClick();
    } else {
      const clickTimeout = setTimeout(() => {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
        handleClickPhoto(e);
      }, 200);
      setClickTimeout(clickTimeout);
    }
  };


  const widthAttribute: string = props.cellWidth.toString() + 'px';
  const imgHeightAttribute: string = props.rowHeight.toString() + 'px';
  const divHeightAttribute: string = (props.rowHeight).toString() + 'px';


  let borderAttr: string = borderSizeStr + ' ';
  borderAttr += props.isSelected ? ' solid blue' : ' solid white';

  return (
    <Tooltip
      title={props.mediaItem.fileName}
      placement='top'
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -32],
              },
            },
          ],
        },
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          width: widthAttribute,
          height: divHeightAttribute,
          border: borderAttr,
        }}
        onClick={handleClicks}
      >
        <img
          src={photoUrl}
          width={widthAttribute}
          height={imgHeightAttribute}
          loading='lazy'
        />
        {/* Icon overlay */}
        {renderReviewLevelIcon()}
      </div>
    </Tooltip>
  );
};

function mapStateToProps(state: any, ownProps: GridCellPropsFromParent) {
  return {
    isSelected: isMediaItemSelected(state, ownProps.mediaItem),
    mediaItem: ownProps.mediaItem,
    keywordLabels: getKeywordLabelsForMediaItem(state, getMediaItems(state)[ownProps.mediaItemIndex]),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onClickPhoto: selectPhoto,
    onSetLoupeViewMediaItemId: setLoupeViewMediaItemIdRedux,
    onSetPhotoLayoutRedux: setPhotoLayoutRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridCell);

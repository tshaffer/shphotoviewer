import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux, setPhotoLayoutRedux } from '../models';

import '../styles/TedTagger.css';
import { MediaItem, PhotoLayout } from '../types';
import { isMediaItemSelected } from '../selectors';
import { getPhotoUrl } from '../utilities';
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
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => any;
  onSetLoupeViewMediaItemId: (id: string) => any;
  onSetPhotoLayoutRedux: (photoLayout: PhotoLayout) => any;
}

const GridCell = (props: GridCellProps) => {

  const [clickTimeout, setClickTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const mediaItem: MediaItem = props.mediaItem;

  const photoUrl = getPhotoUrl(mediaItem);

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
    </div>
  );
};

function mapStateToProps(state: any, ownProps: GridCellPropsFromParent) {
  return {
    isSelected: isMediaItemSelected(state, ownProps.mediaItem),
    mediaItem: ownProps.mediaItem,
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

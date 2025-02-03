import React from 'react';
import { connect } from 'react-redux';
import { MediaItem, PhotoLayout } from '../types';
import { getMediaItems, isMediaItemSelected } from '../selectors';
import GridCell from './GridCell';
import { TedTaggerDispatch, setLoupeViewMediaItemIdRedux, setPhotoLayoutRedux } from '../models';
import { bindActionCreators } from 'redux';
import { selectPhoto } from '../controllers';

export interface GridRowProps {
  mediaItemIndex: number;
  numMediaItems: number;
  rowHeight: number;
  cellWidths: number[];
  allMediaItems: MediaItem[];
  selectedItems: Record<string, boolean>;
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onSetLoupeViewMediaItemId: (id: string) => void;
  onSetPhotoLayoutRedux: (photoLayout: PhotoLayout) => void;
}

const GridRow = React.memo((props: GridRowProps) => {
  if (!props.allMediaItems.length) return null;

  return (
    <div style={{ height: props.rowHeight, display: 'flex', backgroundColor: 'white' }}>
      {props.cellWidths.map((cellWidth, index) => {
        const mediaIndex = props.mediaItemIndex + index;
        if (mediaIndex >= props.allMediaItems.length) return null;
        const mediaItem = props.allMediaItems[mediaIndex];

        return (
          <GridCell
            key={mediaItem.uniqueId}
            mediaItemIndex={mediaIndex}
            mediaItem={mediaItem}
            rowHeight={props.rowHeight}
            cellWidth={cellWidth}
            isSelected={!!props.selectedItems[mediaItem.uniqueId]} // Pass correct selection state
            onClickPhoto={props.onClickPhoto}
            onSetLoupeViewMediaItemId={props.onSetLoupeViewMediaItemId}
            onSetPhotoLayoutRedux={() => props.onSetPhotoLayoutRedux(PhotoLayout.Loupe)}
          />
        );
      })}
    </div>
  );
});

function mapStateToProps(state: any) {
  const allMediaItems = getMediaItems(state);
  const selectedItems = allMediaItems.reduce((acc, item) => {
    acc[item.uniqueId] = isMediaItemSelected(state, item);
    return acc;
  }, {} as Record<string, boolean>);

  return {
    allMediaItems,
    selectedItems, // Store selection state in Row instead of Cell
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onClickPhoto: selectPhoto,
    onSetLoupeViewMediaItemId: setLoupeViewMediaItemIdRedux,
    onSetPhotoLayoutRedux: setPhotoLayoutRedux,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridRow);

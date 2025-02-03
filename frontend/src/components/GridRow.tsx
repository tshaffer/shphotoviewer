import React from 'react';
import { connect } from 'react-redux';
import { MediaItem } from '../types';
import { getMediaItems } from '../selectors';
import GridCell from './GridCell';

export interface GridRowProps {
  mediaItemIndex: number;
  numMediaItems: number;
  rowHeight: number;
  cellWidths: number[];
  allMediaItems: MediaItem[];
}

const GridRow = (props: GridRowProps) => {
  if (!props.allMediaItems.length) return null;

  return (
    <div style={{ height: props.rowHeight, display: 'flex', backgroundColor: 'white' }}>
      {props.cellWidths.map((cellWidth, index) => {
        const mediaIndex = props.mediaItemIndex + index;
        if (mediaIndex >= props.allMediaItems.length) return null;
        return (
          <GridCell
            key={mediaIndex}
            mediaItemIndex={mediaIndex} // Pass mediaItemIndex explicitly
            mediaItem={props.allMediaItems[mediaIndex]}
            rowHeight={props.rowHeight}
            cellWidth={cellWidth}
          />
        );
      })}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    allMediaItems: getMediaItems(state),
  };
}

export default connect(mapStateToProps)(GridRow);

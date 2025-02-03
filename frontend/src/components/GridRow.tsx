import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MediaItem } from '../types';
import { TedTaggerDispatch } from '../models';
import { getDisplayMetadata, getMediaItems } from '../selectors';
import GridCell from './GridCell';
import { bordersSize } from '../constants';

export interface GridRowPropsFromParent {
  mediaItemIndex: number;
  numMediaItems: number;
  rowHeight: number;
  cellWidths: number[];
}

export interface GridRowProps extends GridRowPropsFromParent {
  allMediaItems: MediaItem[],
  displayMetadata: boolean;
}

const GridRow = (props: GridRowProps) => {

  if (props.allMediaItems.length === 0) {
    return null;
  }
  
  const getGridCell = (mediaItemIndex: number, cellWidth: number): JSX.Element => {
    return (
      <GridCell
        key={mediaItemIndex}
        mediaItemIndex={mediaItemIndex}
        mediaItem={props.allMediaItems[mediaItemIndex]}
        rowHeight={props.rowHeight}
        cellWidth={cellWidth}
      />
    );
  };

  const getGridCells = (): JSX.Element[] => {
    const gridCells: JSX.Element[] = [];
    for (let index = props.mediaItemIndex; index < (props.mediaItemIndex + props.numMediaItems); index++) {
      const cellWidth = props.cellWidths[index - props.mediaItemIndex];
      const gridCellElement = getGridCell(index, cellWidth);
      gridCells.push(gridCellElement);
    }
    return gridCells;
  };

  const gridCells = getGridCells();

  const metadataHeight: number = props.displayMetadata ? 60 : 0;
  const heightAttribute: string = (props.rowHeight + metadataHeight + bordersSize).toString() + 'px';

  return (
    <div style={{
      height: heightAttribute,
      backgroundColor: 'white',
    }}>
      {gridCells}
    </div>
  );

};

function mapStateToProps(state: any, ownProps: any) {
  return {
    allMediaItems: getMediaItems(state),
    displayMetadata: getDisplayMetadata(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridRow);

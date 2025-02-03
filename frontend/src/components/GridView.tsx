import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

import { GridRowData, MediaItem } from '../types';
import { TedTaggerDispatch } from '../models';
import { getAppInitialized, getMediaItems, getNumGridColumns, getScrollPosition } from '../selectors';
import GridRow from './GridRow';
import { getGridRowHeight } from '../utilities';
import { centerColumnWidth, targetHeights } from '../constants';

export interface GridViewProps {
  appInitialized: boolean;
  allMediaItems: MediaItem[];
  numGridColumns: number;
  scrollPosition: number;
}

const GridView = (props: GridViewProps) => {
  if (!props.appInitialized || props.allMediaItems.length === 0) {
    return null;
  }

  const targetHeight = targetHeights[props.numGridColumns - 2];

  // Generate virtualized row data
  const gridRows: GridRowData[] = React.useMemo(() => {
    const rows: GridRowData[] = [];
    let mediaItemIndex = 0;
    while (mediaItemIndex < props.allMediaItems.length) {
      const rowData = getGridRowHeight(
        centerColumnWidth,
        targetHeight,
        props.allMediaItems,
        mediaItemIndex,
        props.allMediaItems.length - 1
      );
      mediaItemIndex += rowData.numMediaItems;
      rows.push(rowData);
    }
    return rows;
  }, [props.allMediaItems, props.numGridColumns]);

  const rowHeight = targetHeight; // Approximate row height

  // Function to render each row
  const RowRenderer = ({ index, style }: ListChildComponentProps) => {
    const rowData = gridRows[index];
    return <div style={style}><GridRow {...rowData} /></div>;
  };

  return (
    <List
      height={window.innerHeight - 100} // Adjust height dynamically
      itemCount={gridRows.length}
      itemSize={rowHeight}
      width={centerColumnWidth}
    >
      {RowRenderer}
    </List>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    allMediaItems: getMediaItems(state),
    numGridColumns: getNumGridColumns(state),
    scrollPosition: getScrollPosition(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridView);

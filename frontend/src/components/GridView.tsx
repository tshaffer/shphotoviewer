import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { GridRowData, MediaItem } from '../types';
import { TedTaggerDispatch } from '../models';
import { getAppInitialized, getMediaItems, getNumGridColumns, getScrollPosition } from '../selectors';
import GridRow from './GridRow';
import { getGridRowHeight } from '../utilities';
import { centerColumnWidth, targetHeights } from '../constants';

export interface GridViewProps {
  appInitialized: boolean;
  allMediaItems: MediaItem[],
  numGridColumns: number;
  scrollPosition: number;
}

const GridView = (props: GridViewProps) => {

  React.useEffect(() => {

    const divElement = document.getElementById('centerColumn') as HTMLDivElement | null;
    if (divElement) {
      // console.log('set scroll position: ', props.scrollPosition);
      divElement.scrollTop = props.scrollPosition;
    } else {
      // console.log('divElement does not exist');
    }

    return () => {
      // console.log('GridView React.useEffect for removing event listener invoked');
    };
  }, []);


  const getGridRowData = (): GridRowData[] => {

    const targetHeight = targetHeights[props.numGridColumns - 2];

    const gridRows: GridRowData[] = [];
    let mediaItemIndex = 0;
    while (mediaItemIndex < (props.allMediaItems.length - 1)) {
      const gridRowData: GridRowData = getGridRowHeight(centerColumnWidth, targetHeight, props.allMediaItems, mediaItemIndex, props.allMediaItems.length - 1);
      mediaItemIndex = mediaItemIndex + gridRowData.numMediaItems;
      gridRows.push(gridRowData);
    }
    return gridRows;
  };

  const renderGridRow = (gridRowData: GridRowData): JSX.Element => {
    const { mediaItemIndex, numMediaItems, rowHeight, cellWidths } = gridRowData;
    return (
      <GridRow
        key={mediaItemIndex}
        mediaItemIndex={mediaItemIndex}
        numMediaItems={numMediaItems}
        rowHeight={rowHeight}
        cellWidths={cellWidths}
      />
    );
  };

  const renderGridRows = (gridRows: GridRowData[]): JSX.Element[] => {
    const renderedGridRows: JSX.Element[] = gridRows.map((gridRowData: GridRowData, index: number) => {
      const renderedGridRow = renderGridRow(gridRowData);
      return renderedGridRow;
    });

    return renderedGridRows;
  };

  if (!props.appInitialized) {
    return null;
  }

  if (props.allMediaItems.length === 0) {
    return null;
  }

  const gridRows: GridRowData[] = getGridRowData();
  const renderedGridRows = renderGridRows(gridRows);

  return (
    <div>
      {renderedGridRows}
    </div>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    appInitialized: getAppInitialized(state),
    allMediaItems: getMediaItems(state),
    numGridColumns: getNumGridColumns(state),
    scrollPosition: getScrollPosition(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GridView);

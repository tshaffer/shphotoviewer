import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid, Card, GridSize } from '@mui/material';
import SurveyViewImageContainer from './SurveyViewImageContainer';

import { TedTaggerDispatch } from '../models';
import { MediaItem } from '../types';

import { getSurveyModeZoomFactor } from '../selectors';

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  margin: '8px',
  width: '100%',
  height: '100%',
  backgroundColor: 'lightcoral',
  boxShadow: 'none',
};

export interface SurveyViewGridItemsPropsFromParent {
  mediaItem: MediaItem;
  numGridColumns: number;
  numGridRows: number;
}

export interface SurveyViewGridItemsProps extends SurveyViewGridItemsPropsFromParent {
  surveyModeZoomFactor: number;
}

function SurveyViewGridItems(props: SurveyViewGridItemsProps) {

  const numColumns: number = props.numGridColumns;
  const gridItemSize: GridSize = 12 / numColumns;

  return (
    <Grid item lg={gridItemSize}>
      <Card
        sx={cardStyle}
      >
        <SurveyViewImageContainer
          mediaItem={props.mediaItem}
          numGridColumns={props.numGridColumns}
          numGridRows={props.numGridRows}
        >
        </SurveyViewImageContainer>
      </Card>
    </Grid>
  );
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    mediaItem: ownProps.mediaItem,
    surveyModeZoomFactor: getSurveyModeZoomFactor(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyViewGridItems);

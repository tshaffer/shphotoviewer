import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from '@mui/material/Button';
import { FormControl } from '@mui/material';

import { TedTaggerDispatch, setNumGridColumnsRedux } from '../models';
import { getNumGridColumns } from '../selectors';

export interface ZoomGroupProps {
  numGridColumns: number;
  onSetNumGridColumns: (numGridColumns: number) => void;
}

function ZoomGroup(props: ZoomGroupProps) {

  const handleZoomIn = (): void => {
    let numGridColumns = props.numGridColumns;
    numGridColumns = numGridColumns - 1;
    if (numGridColumns < 2) {
      return;
    }
    props.onSetNumGridColumns(numGridColumns);
  };

  const handleZoomOut = (): void => {
    let numGridColumns = props.numGridColumns;
    if (numGridColumns >= 10) {
      return;
    }
    numGridColumns = numGridColumns + 1;
    props.onSetNumGridColumns(numGridColumns);
  };

  return (
    <FormControl style={{ marginLeft: '0px' }}>
      <span style={{ marginTop: '6px', marginBottom: '6px', display: 'block' }}>Zoom</span>
      <Button
        variant="outlined"
        style={{
          marginBottom: '8px',
        }}
        onClick={handleZoomIn}
      >
        Zoom In
      </Button>
      <Button
        variant="outlined"
        onClick={handleZoomOut}
      >Zoom Out</Button>
    </FormControl>
  );
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    numGridColumns: getNumGridColumns(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onSetNumGridColumns: setNumGridColumnsRedux
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ZoomGroup);

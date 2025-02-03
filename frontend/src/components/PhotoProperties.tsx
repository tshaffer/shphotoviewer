import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TedTaggerDispatch } from '../models';
import { Box } from '@mui/material';

import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

import { MediaItem } from '../types';
import { getFullScreenMediaItemId, getMediaItemById, getSelectedMediaItemIds } from '../selectors';
import { isNil } from 'lodash';
import { formatISOString } from '../utilities';

export interface PhotoPropertiesProps {
  mediaItem: MediaItem | null,
}

const PhotoProperties = (props: PhotoPropertiesProps) => {

  if (isNil(props.mediaItem)) {
    return null;
  }

  const renderCreationTime = (): JSX.Element | null => {

    if (isNil(props.mediaItem!.creationTime)) {
      return null;
    }

    const formattedDate = formatISOString(props.mediaItem!.creationTime);

    return (
      <React.Fragment>
        {formattedDate}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ marginLeft: '8px', width: '100%', minWidth: 300, maxWidth: 360, bgcolor: 'background.paper' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EventOutlinedIcon />
          <span style={{ marginLeft: '10px' }}>
            {renderCreationTime()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ImageOutlinedIcon />
          <span style={{ marginLeft: '10px' }}>
            {props.mediaItem?.fileName}
          </span>
        </div>
      </div>
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    mediaItem: getMediaItemById(state, getFullScreenMediaItemId(state)),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoProperties);

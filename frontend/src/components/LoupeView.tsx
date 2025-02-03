import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../styles/TedTagger.css';
import { TedTaggerDispatch } from '../models';
import { getFullScreenMode, getLoupeViewMediaItemId, getMediaItemById } from '../selectors';
import { MediaItem } from '../types';
import { getPhotoUrl } from '../utilities';
import { isNil } from 'lodash';
import { bodyMargins, toolbarHeight } from '../constants';
import { Tooltip } from '@mui/material';

export interface LoupeViewProps {
  mediaItem: MediaItem | null;
  fullScreenMode: boolean;
}

const LoupeView = (props: LoupeViewProps) => {

  const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isNil(props.mediaItem)) {
    return null;
  }

  const src = getPhotoUrl(props.mediaItem);

  const maxHeightInPixels = windowDimensions.height - (props.fullScreenMode ? 0 : toolbarHeight + bodyMargins);
  const maxHeightProperty = maxHeightInPixels.toString() + 'px';

  return (
    <div
      id='loupeViewImage'
    >
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
        <div>
          <img
            style={{ width: '100%', objectFit: 'contain', maxHeight: maxHeightProperty }}
            src={src}
          />
        </div>
      </Tooltip>
    </div>
  );
};

function mapStateToProps(state: any) {
  const loupeViewMediaItemId = getLoupeViewMediaItemId(state);
  return {
    mediaItem: getMediaItemById(state, loupeViewMediaItemId),
    fullScreenMode: getFullScreenMode(state),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LoupeView);

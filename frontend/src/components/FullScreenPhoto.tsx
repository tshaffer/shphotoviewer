import * as React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import path from 'path-browserify';

import { MediaItem } from '../types';
import { TedTaggerDispatch } from '../models';
import { getMediaItemById, getFullScreenMediaItemId } from '../selectors';
import { getPhotoUrl } from '../utilities';


export interface FullScreenPhotoProps {
  mediaItem: MediaItem | null;
}

function FullScreenPhoto(props: FullScreenPhotoProps) {

  // const containerRef: any = React.useRef();

  // React.useEffect(() => {
  //   if (!isNil(containerRef) && !isNil(containerRef.current)) {
  //     const { width, height } = (containerRef.current as any).getBoundingClientRect();
  //     console.log('width, height', width, height);
  //     console.log('offsetWidth', containerRef.current.parentElement.offsetWidth);
  //     console.log('offsetHeight', containerRef.current.parentElement.offsetHeight);
  //     console.log('clientHeight', containerRef.current.parentElement.clientHeight);
  //   }
  // }, []);

  const src = getPhotoUrl(props.mediaItem!);

  // TEDTODO - scaling - need to remove hardcoded width and height.

  // https://www.npmjs.com/package/react-sizes

  // https://stackoverflow.com/questions/34247337/object-fit-not-affecting-images
  // the following doesn't work.
  // style={{ width: '2048px', height: '1536px', objectFit: 'contain', }}

  // the following works.
  //  <div ref={containerRef} style={{ width: '1450px', height: '748px' }}>
  //    style={{ width: '100%', height: '100%', objectFit: 'contain' }}

  // the following works.
  //  <div ref={containerRef} style={{ width: '1640px', height: '790px' }}>
  //    style={{ width: '100%', height: '100%', objectFit: 'contain' }}

  return (
    <div style={{ width: '1640px', height: '790px' }}>
      <img
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        src={src}
      />
    </div>
  );
}


function mapStateToProps(state: any, ownProps: any) {
  return {
    mediaItem: getMediaItemById(state, getFullScreenMediaItemId(state)),
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenPhoto);

import * as React from 'react';
import { MediaItem } from '../types';
import { getPhotoUrl } from '../utilities';

export interface SurveyViewImageProps {
  mediaItem: MediaItem;
  zoomFactor: number;
}

const SurveyViewImage = React.memo((props: SurveyViewImageProps) => {
  const photoUrl = getPhotoUrl(props.mediaItem);
  const elementId = `surveyImage${props.mediaItem.uniqueId}`;

  return (
    <img
      id={elementId}
      src={photoUrl}
      className="surveyImageStyle"
      style={{ transform: `scale(${props.zoomFactor})` }}
      loading="lazy"
    />
  );
});

export default SurveyViewImage;

import * as React from 'react';
import { MediaItem } from '../types';
import { getPhotoUrl } from '../utilities';
import { borderSizeStr } from '../constants';

export interface GridCellProps {
  mediaItemIndex: number;
  mediaItem: MediaItem;
  rowHeight: number;
  cellWidth: number;
  isSelected: boolean;
  onClickPhoto: (id: string, commandKey: boolean, shiftKey: boolean) => void;
  onSetLoupeViewMediaItemId: (id: string) => void;
  onSetPhotoLayoutRedux: () => void;
}

const GridCell = React.memo((props: GridCellProps) => {
  const mediaItem: MediaItem = props.mediaItem;
  const photoUrl = getPhotoUrl(mediaItem);

  const handleDoubleClick = () => {
    props.onSetLoupeViewMediaItemId(props.mediaItem.uniqueId);
    props.onSetPhotoLayoutRedux();
  };

  const handleClickPhoto = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    props.onClickPhoto(props.mediaItem.uniqueId, e.metaKey, e.shiftKey);
  };

  const widthAttribute = `${props.cellWidth}px`;
  const imgHeightAttribute = `${props.rowHeight}px`;
  const divHeightAttribute = `${props.rowHeight}px`;

  let borderAttr = `${borderSizeStr} ${props.isSelected ? 'solid blue' : 'solid white'}`;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: widthAttribute,
        height: divHeightAttribute,
        border: borderAttr,
      }}
      onClick={handleClickPhoto}
      onDoubleClick={handleDoubleClick}
    >
      <img src={photoUrl} width={widthAttribute} height={imgHeightAttribute} loading="lazy" />
    </div>
  );
});

export default GridCell;

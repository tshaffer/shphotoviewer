import { cloneDeep } from 'lodash';
import { bordersSize } from '../constants';
import { GridRowData, MediaItem } from '../types';

export const getGridRowHeight = (
  rowWidth: number,
  targetHeight: number,
  mediaItems: MediaItem[],
  startingMediaItemIndex: number,
  maxRowIndex: number
): GridRowData => {
  const margin = 8; // Total margin (4px left + 4px right)
  let totalWidth = 0;
  let totalImageWidth = 0;
  let itemCount = 0;
  let adjustedHeight = targetHeight;
  const itemWidths: number[] = [];
  const itemWidthsWithoutMargin: number[] = [];

  const roundToPrecision = (value: number, precision: number): number => {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  };

  // First pass: Determine how many items can fit in the row using the target height
  for (let i = startingMediaItemIndex; i <= maxRowIndex; i++) {
    const item = mediaItems[i];
    const itemAspectRatio = item.width! / item.height!;
    const scaledWidth = itemAspectRatio * targetHeight;
    const scaledWidthWithMargin = scaledWidth + margin;

    // Check if adding this item would exceed the row width
    if (totalWidth + scaledWidthWithMargin > rowWidth) {
      break;
    }

    totalWidth += scaledWidthWithMargin;
    totalImageWidth += scaledWidth;
    itemCount++;
  }

  // Adjust height if the row was not filled using the target height
  if (totalWidth < rowWidth && itemCount > 0) {
    adjustedHeight = targetHeight * ((rowWidth - (itemCount * margin)) / totalImageWidth);
  }

  // Second pass: Calculate the rendered width of each item in the row using the adjusted height
  for (let i = startingMediaItemIndex; i < startingMediaItemIndex + itemCount; i++) {
    const item = mediaItems[i];
    const itemAspectRatio = item.width! / item.height!;
    const scaledWidthWithoutMargin = itemAspectRatio * adjustedHeight;
    itemWidthsWithoutMargin.push(roundToPrecision(scaledWidthWithoutMargin, 2));
  }

  return {
    mediaItemIndex: startingMediaItemIndex,
    numMediaItems: itemCount,
    rowHeight: adjustedHeight,
    cellWidths: itemWidthsWithoutMargin,
  };
};

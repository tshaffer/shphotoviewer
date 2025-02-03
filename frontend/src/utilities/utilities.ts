import path from 'path-browserify';
import { MediaItem } from '../types';

export const formatISOString = (ISOString: string): string => {

  const date = new Date(ISOString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  return formattedDate;
};

export const getPhotoUrl = (mediaItem: MediaItem): string => {
  const basename: string = path.basename(mediaItem.filePath!);
  const extension: string = path.extname(basename);
  const extensionLength: number = extension.length;
  const numChars = basename.length;
  const photoUrl = path.join(
    '/images',
    basename.charAt(numChars - (extensionLength + 2)),
    basename.charAt(numChars - (extensionLength + 1)),
    basename,
  );

  return photoUrl;
};


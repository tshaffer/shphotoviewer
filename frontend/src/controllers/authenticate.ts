import axios from 'axios';
import { TedTaggerAnyPromiseThunkAction, TedTaggerDispatch, setDeletedMediaItems } from '../models';
import { serverUrl, apiUrlFragment, MediaItem } from '../types';

export const authenticate = (): TedTaggerAnyPromiseThunkAction => {

  return (dispatch: TedTaggerDispatch) => {

    const path = serverUrl
      + apiUrlFragment
      + 'authenticate';

    return axios.get(path)
      .then((response: any) => {
        console.log('authenticate response');
        console.log(response);
        console.log(response.data);
        return Promise.resolve();
      });
  };
};


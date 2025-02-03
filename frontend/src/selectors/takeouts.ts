import {
  Takeout,
  TedTaggerState
} from '../types';

export const getTakeouts = (state: TedTaggerState): Takeout[] => {
  return state.takeoutsState.takeouts;
};

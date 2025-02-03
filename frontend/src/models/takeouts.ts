import { cloneDeep } from 'lodash';

import { Takeout, TakeoutsState } from '../types';
import { TedTaggerModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_TAKEOUTS = 'ADD_TAKEOUTS';

// ------------------------------------
// Actions
// ------------------------------------

interface AddTakeoutsPayload {
  takeouts: Takeout[];
}

export const addTakeouts = (
  takeouts: Takeout[],
): any => {
  return {
    type: ADD_TAKEOUTS,
    payload: {
      takeouts
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: TakeoutsState =
{
  takeouts: [],
};

export const takeoutsStateReducer = (
  state: TakeoutsState = initialState,
  action: TedTaggerModelBaseAction<AddTakeoutsPayload>
): TakeoutsState => {
  switch (action.type) {
    case ADD_TAKEOUTS: {
      const newState = cloneDeep(state) as TakeoutsState;
      newState.takeouts = newState.takeouts.concat(action.payload.takeouts);
      return newState;
    }
    default:
      return state;
  }
};

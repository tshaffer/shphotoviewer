/** @module Model:base */

import { combineReducers } from 'redux';
import { TedTaggerState } from '../types';

import { appStateReducer } from './appState';
import { mediaItemsStateReducer } from './mediaItems';
import { selectedMediaItemsStateReducer } from './selectedMediaItems';
import { keywordsStateReducer } from './keywords';
import { searchUIStateReducer } from './searchUI';
import { takeoutsStateReducer } from './takeouts';
import { photoViewSpecReducer } from './photoViewSpec';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TedTaggerState>({
  appState: appStateReducer,
  mediaItemsState: mediaItemsStateReducer,
  selectionsState: selectedMediaItemsStateReducer,
  keywordsState: keywordsStateReducer,
  searchUIState: searchUIStateReducer,
  takeoutsState: takeoutsStateReducer,
  photoViewSpec: photoViewSpecReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------


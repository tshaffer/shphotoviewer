import {
  Action,
  AnyAction,
} from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { TedTaggerState } from '../types';

export interface TedTaggerBaseAction extends Action {
  type: string;   // override Any - must be a string
  payload: {} | null;
}

export interface TedTaggerModelBaseAction<T> extends Action {
  type: string;   // override Any - must be a string
  payload: T;
  // error?: boolean;
  // meta?: {};
}

export interface TedTaggerAction<T> extends TedTaggerBaseAction {
  payload: T | any;
}

export type TedTaggerDispatch = ThunkDispatch<TedTaggerState, undefined, TedTaggerAction<AnyAction>>;
export type TedTaggerVoidPromiseThunkAction = (dispatch: TedTaggerDispatch, getState: () => TedTaggerState, extraArgument: undefined) => Promise<void>;
export type TedTaggerAnyPromiseThunkAction = (dispatch: TedTaggerDispatch, getState: () => TedTaggerState, extraArgument: undefined) => Promise<any>;

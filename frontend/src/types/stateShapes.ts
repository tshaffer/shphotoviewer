import { StringToKeywordLUT, StringToKeywordNodeLUT, StringToNumberLUT } from './base';
import { GoogleUserProfile, MediaItem, Takeout } from './entities';
import {
  DateSearchRuleType,
  KeywordSearchRuleType,
  MainDisplayMode,
  MatchRule,
  PhotoLayout,
  SearchRuleType,
} from './enums';

export interface TedTaggerState {
  appState: AppState;
  keywordsState: KeywordsState;
  mediaItemsState: MediaItemsState;
  photoViewSpec: PhotoViewSpec;
  searchUIState: SearchUIState;
  selectionsState: SelectedMediaItemsState;
  takeoutsState: TakeoutsState;
}

export interface AppState {
  appInitialized: boolean;
  mainDisplayMode: MainDisplayMode;
  fullScreenMediaItemId: string;
  googleUserProfile: GoogleUserProfile | null;
}

export interface MediaItemsState {
  mediaItems: MediaItem[];
  deletedMediaItems: MediaItem[];
  loupeViewMediaItemIds: string[];
}

export interface SelectedMediaItemsState {
  lastClickedId: string | null;
  selectedMediaItemIds: string[];
}

export interface KeywordsState {
  keywordsById: StringToKeywordLUT;
  keywordNodesByNodeId: StringToKeywordNodeLUT;
  keywordRootNodeId: string;
}

export interface SearchUIState {
  matchRule: MatchRule;
  searchRules: SearchRule[];
}

export interface SearchRule {
  searchRuleType: SearchRuleType;
  searchRule: KeywordSearchRule | DateSearchRule;
}

export interface DateSearchRule {
  dateSearchRuleType: DateSearchRuleType;
  date: string;
  date2?: string;
}

export interface KeywordSearchRule {
  keywordSearchRuleType: KeywordSearchRuleType;
  keywordNodeId?: string;
}

export interface TakeoutsState {
  takeouts: Takeout[];
}

export interface LocalStorageState {
  folders: string[];
}

export interface PhotoViewSpec {
  photoLayout: PhotoLayout;
  numGridColumns: number;
  loupeViewMediaItemId: string;
  displayMetadata: boolean;
  surveyModeZoomFactor: number;
  scrollPosition: number;
  fullScreenMode: boolean;
  mediaItemZoomFactorById: StringToNumberLUT;
}
export enum MainDisplayMode {
  Grid = 'grid',
  FullScreen = 'fullScreen',
}

export enum KeywordAssignedToSelectedMediaItemsStatus {
  AllSelectedMediaItemsIncludeThisKeyword = 'AllSelectedMediaItemsIncludeThisKeyword',
  SomeSelectedMediaItemsIncludeThisKeyword = 'SomeSelectedMediaItemsIncludeThisKeyword',
  NoSelectedMediaItemsIncludeThisKeyword = 'NoSelectedMediaItemsIncludeThisKeyword',
}

export enum MatchRule {
  all = 'all',
  any = 'any',
}

export enum SearchRuleType {
  Keyword = 'keyword',
  Date = 'date',
}

export enum KeywordSearchRuleType {
  Contains = 'contains',
  AreEmpty = 'areEmpty',
  AreNotEmpty = 'areNotEmpty',
}

export enum DateSearchRuleType {
  IsInTheRange = 'isInTheRange',
  IsBefore = 'isBefore',
  IsAfter = 'isAfter',
}

export enum PhotoLayout {
  Grid = 'grid',
  Loupe = 'loupe',
  Survey = 'survey',
}

export enum ReviewLevel {
  Mixed = 'mixed',
  Unreviewed = 'unreviewed',
  ReadyForReview = 'readyForReview',
  ReadyForUpload = 'readyForUpload',
  UploadedToGoogle = 'uploadedToGoogle',
}

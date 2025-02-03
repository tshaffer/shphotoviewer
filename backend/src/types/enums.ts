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

export enum ReviewLevel {
  Unreviewed = 'unreviewed',
  ReadyForReview = 'readyForReview',
  ReadyForUpload = 'readyForUpload',
  UploadedToGoogle = 'uploadedToGoogle',
}

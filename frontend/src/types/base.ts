import { Keyword, KeywordNode } from './entities';

// export const serverUrl = 'http://localhost:8080';
export const serverUrl = 'http://localhost:5173';
// export const serverUrl = 'https://tsmealwheel.herokuapp.com';

export const apiUrlFragment = '/api/v1/';

export type StringToStringLUT = {
  [key: string]: string;
}

export type StringToStringArrayLUT = {
  [key: string]: string[];
}

export type StringToBooleanLUT = {
  [key: string]: boolean;
}

export type StringToKeywordLUT = {
  [key: string]: Keyword;
}

export type StringToKeywordNodeLUT = {
  [key: string]: KeywordNode;
}

export type StringToNumberLUT = {
  [key: string]: number;
}

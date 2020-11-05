import { Chapter, CollectingBooks, ReadingBooks, TYPE } from '../app/entity';

export interface IBook {
  id: number;
  click: number;
  title: string;
  author: string;
  coverImgLink: string;
  summary: string;
  finish: boolean;
  type: TYPE;
  rank: number;
  recommendIndex: number;
  created_at: Date;
  updated_at: Date;

  chapters?: Chapter[];
  readingBooks?: ReadingBooks[];
  collectingBooks?: CollectingBooks[];
}
export interface IBookRequiredParam {
  title: string;
  author: string;
  coverImgLink: string;
  summary: string;
}

export interface IIndexBookResult {
  id: number;
  title: string;
  author: string;
  coverImgLink: string;
  summary: string;
}

export interface ISearchBookResult {
  title: IIndexBookResult[] | null;
  author: IIndexBookResult[] | null;
}

export interface IRankListResult {
  id: number;
  title: string;
  author: string;
  coverImgLink: string;
  summary: string;
  type: string;
}

export interface IBookDetail {
  id: number;
  click: number;
  title: string;
  author: string;
  coverImgLink: string;
  summary: string;
  finish: boolean;
  type: TYPE;
  updated_at: Date;
  chaptersNum: number;
}

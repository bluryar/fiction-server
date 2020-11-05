import { Book } from '../app/entity';

export interface IChapter {
  id: number;
  content: Buffer;
  index: number;
  title: string;
  book: Book;
  created_at: Date;
  updated_at: Date;
}

export interface IChapterBrief {
  id: number;
  index: number;
  title: string;
  book: Book;
  created_at: Date;
  updated_at: Date;
}

export interface IChapterContent {
  content: Buffer | string;
  index: number;
  title: string;
}

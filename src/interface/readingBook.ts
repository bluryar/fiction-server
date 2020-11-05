import { Book, Reader } from '../app/entity';

export interface IReadingBooks {
  id: number;
  duration: number;
  created_at: Date;
  updated_at: Date;
  reader: Reader;
  book: Book;
}

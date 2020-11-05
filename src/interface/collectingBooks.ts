import { Book, Reader } from '../app/entity';

export interface ICollectingBooks {
  id: number;
  created_at: Date;
  reader?: Reader;
  book?: Book;
}

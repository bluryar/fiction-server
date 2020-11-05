import { CollectingBooks, ReadingBooks } from '../app/entity';

export interface IReader {
  id: number;
  username: string;
  password: string;
  nickname: number;
  loginIp: string;
  banned: boolean;
  created_at: Date;
  updated_at: Date;
  readingBooks?: ReadingBooks[];
  collectingBooks?: CollectingBooks[];
}

import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './Book';
import { Reader } from './Reader';

@Entity()
export class CollectingBooks implements CollectingBooks {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public created_at: Date;

  @ManyToOne((type) => Reader, (reader) => reader.collectingBooks)
  @JoinColumn()
  public reader: Reader;

  @ManyToOne((type) => Book, (book) => book.collectingBooks)
  @JoinColumn()
  public book: Book;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './Book';
import { Reader } from './Reader';

@Entity()
export class ReadingBooks {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    default: 0,
    comment: '阅读时长(以ms为单位), 用户每次看下一章就会触发这个字段的增长',
  })
  public duration: number;

  @CreateDateColumn()
  public created_at: Date;

  @CreateDateColumn()
  public updated_at: Date;

  @ManyToOne((type) => Reader, (reader) => reader.readingBooks)
  @JoinColumn()
  public reader: Reader;

  @ManyToOne((type) => Book, (book) => book.readingBooks)
  @JoinColumn()
  public book: Book;
}

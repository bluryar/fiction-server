import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { gzipSync, unzipSync } from 'zlib';
import { IChapter } from '../../interface';
import { Book } from './Book';

@Entity()
// @Index(['title', 'book', 'index'], { unique: true })
export class Chapter implements IChapter {
  static gzipChapterContent(chapter: Chapter): Chapter {
    chapter.content = gzipSync(chapter.content);
    return chapter;
  }
  static unzipChapterContent(chapter: Chapter): Chapter {
    chapter.content = unzipSync(chapter.content);
    return chapter;
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'blob' })
  public content: Buffer;

  @Column({ type: 'smallint' })
  public index: number;

  @Column()
  public title: string;

  @ManyToOne((type) => Book, (book) => book.chapters)
  public book: Book;

  @CreateDateColumn()
  public created_at: Date;

  @CreateDateColumn()
  public updated_at: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IBook, IBookRequiredParam } from '../../interface';
import { Chapter } from './Chapter';
import { CollectingBooks } from './CollectingBooks';
import { ReadingBooks } from './ReadingBooks';

export enum TYPE {
  // 全部分类=0
  未分类 = '未分类', // 1
  玄幻 = '玄幻', // 2
  奇幻 = '奇幻', // 3
  修真 = '修真', // 4
  仙侠 = '仙侠', // 5
  都市 = '都市', // 6
  青春 = '青春', // 7
  历史 = '历史', // 8
  穿越 = '穿越', // 9
  网游 = '网游', // 10
  竞技 = '竞技', // 11
  科幻 = '科幻', // 12
  灵异 = '灵异', // 13
}

@Entity()
// @Index(["title", "author"], { unique: true })
export class Book implements IBook {
  public static bookFactory(input: IBookRequiredParam) {
    const book = new Book();
    book.title = input.title;
    book.author = input.author;
    book.coverImgLink = input.coverImgLink;
    book.summary = input.summary;
    return book;
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: 0 })
  public click: number;

  @Column()
  public title: string;

  @Column()
  public author: string;

  @Column()
  public coverImgLink: string;

  @Column({ type: 'varchar', length: '1000' })
  public summary: string;

  @Column({ default: true })
  public finish: boolean;

  @Column({ type: 'enum', enum: TYPE, default: TYPE.未分类 })
  public type: TYPE;

  @Column({ default: 0 })
  public rank: number;

  @Column({ default: 0, comment: '推荐顺序，每天固定时间发生变化' })
  public recommendIndex: number;

  @CreateDateColumn()
  public created_at: Date;

  @CreateDateColumn()
  public updated_at: Date;

  @OneToMany((type) => Chapter, (chapters) => chapters.book, { cascade: true })
  public chapters: Chapter[];

  @OneToMany((type) => ReadingBooks, (readingBooks) => readingBooks.book)
  public readingBooks: ReadingBooks[];

  @OneToMany(
    (type) => CollectingBooks,
    (collectingBooks) => collectingBooks.book
  )
  public collectingBooks: CollectingBooks[];
}

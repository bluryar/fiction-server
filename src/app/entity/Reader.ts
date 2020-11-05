import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReadingBooks } from './ReadingBooks';
import { CollectingBooks } from './CollectingBooks';
import { IReader } from '../../interface';

@Entity()
export class Reader implements IReader {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public password: string;

  @Column()
  public nickname: number;

  @Column()
  public loginIp: string;

  @Column({ type: 'bool', default: false, comment: '用户是否违反规定被ban' })
  public banned: boolean;

  @CreateDateColumn()
  public created_at: Date;

  @CreateDateColumn()
  public updated_at: Date;

  @OneToMany((type) => ReadingBooks, (readingBooks) => readingBooks.reader)
  public readingBooks: ReadingBooks[];

  @OneToMany(
    (type) => CollectingBooks,
    (collectingBooks) => collectingBooks.reader
  )
  public collectingBooks: CollectingBooks[];
}

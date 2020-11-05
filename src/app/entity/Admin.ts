import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IAdmin } from '../../interface';

@Entity()
export class Admin implements IAdmin {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public password: string;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '[占位符] 管理员优先级, 越小权力越大,默认为0',
  })
  public priority: number;

  @Column()
  public loginIp: string;

  @CreateDateColumn()
  public created_at: Date;

  @CreateDateColumn()
  public updated_at: Date;
}

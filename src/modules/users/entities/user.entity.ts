import { Blog } from 'src/modules/blogs/entities/blog.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  firstName: string;

  @Column('varchar', { length: 1000,nullable: true})
  lastName: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column({select:false})
  password: string;

  @Column()
  refreshToken: String;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Blog, (blog) => blog.user) 
  blogs: Blog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

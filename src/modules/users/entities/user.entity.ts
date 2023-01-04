import { Blog } from "src/modules/blogs/entities/blog.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("varchar", { length: 100 })
  firstName: string;

  @Column("varchar", { length: 1000 })
  lastName: string;

  @Column("varchar",{unique:true})
  email: string;

  @Column()
  password: string;

  @Column({default:true})
  isActive: boolean;

  @OneToMany(()=>Blog,(blog)=>blog.user)
  blogs:Blog[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;  
}

import { User } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("varchar", { length: 100 })
  title: string;

  @Column("varchar", { length: 1000 })
  description: string;

  @ManyToOne(()=>User,(user)=>user.blogs)  
  user:User

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;  
}

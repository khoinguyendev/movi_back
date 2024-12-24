import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn({type:'bigint'})
    id: number;
  
    @Column({unique: true})
    username: string;
  
    @Column()
    password: string;
    
    @Column()
    createdAt:Date;
    
    @Column({nullable: true})
    hay:string;
    
  }
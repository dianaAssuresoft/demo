import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;
  
  @Column('text')
  password: string;

  @Column('text')
  fullname: string;
  
  @Column('boolean', { default: true, name: 'is_active' })
  isActive: boolean; 
}
import { IsUrl, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/User.entity';
import { Wish } from '../../wish/entities/Wish.entity';

@Entity('wishlist')
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Length(1, 250)
  name: string;
  @Column({
    nullable: true,
    length: 1500,
  })
  description: string;
  @Column({
    nullable: true,
  })
  @IsUrl()
  image: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToMany(() => Wish, (wish) => wish.wishlist)
  @JoinTable()
  items: Wish[];
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
}

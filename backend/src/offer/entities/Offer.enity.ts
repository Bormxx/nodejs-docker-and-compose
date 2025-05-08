import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/User.entity';
import { Wish } from '../../wish/entities/Wish.entity';

@Entity('Offer')
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.offers)
  user: User;
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
  @Column({ default: false })
  hidden: boolean;
}

import { IsUrl, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/User.entity';
import { Wishlist } from '../../wishlist/entities/Wishlist.entity';
import { Offer } from '../../offer/entities/Offer.enity';

@Entity('wish')
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Length(1, 250)
  name: string;
  @Column()
  @IsUrl()
  link: string;
  @Column()
  @IsUrl()
  image: string;
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  raised: number;
  @Column()
  @Length(1, 1024)
  description: string;
  @Column('int', { default: 0 })
  copied: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
  @ManyToOne(() => Wishlist, (user) => user.items)
  wishlist: Wishlist;
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}

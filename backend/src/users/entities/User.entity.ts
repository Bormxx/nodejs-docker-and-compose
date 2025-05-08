import { IsEmail, IsUrl, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wish } from '../../wish/entities/Wish.entity';
import { Offer } from '../../offer/entities/Offer.enity';
import { Wishlist } from '../../wishlist/entities/Wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    unique: true,
  })
  @Length(2, 30)
  username: string;
  @Column({
    nullable: true,
    default: '',
  })
  @Length(2, 200)
  about: string;
  @Column({
    nullable: true,
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;
  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;
  @Column()
  password: string;
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];
  @ManyToMany(() => Offer, (offers) => offers.user)
  @JoinTable()
  offers: Offer[];
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}

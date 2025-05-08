import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistService } from './Wishlist.service';
import { WishlistController } from './Wishlist.controller';
import { Wishlist } from './entities/Wishlist.entity';
import { Wish } from '../wish/entities/Wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Wish])],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports: [WishlistService],
})
export class WishlistModule {}

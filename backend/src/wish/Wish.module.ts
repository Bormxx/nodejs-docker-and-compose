import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/Wish.entity';
import { WishService } from './Wish.service';
import { WishController } from './Wish.controller';
import { User } from '../users/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User])],
  providers: [WishService],
  controllers: [WishController],
  exports: [WishService],
})
export class WishModule {}

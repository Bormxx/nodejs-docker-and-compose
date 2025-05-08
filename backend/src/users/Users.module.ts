import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { UsersService } from './Users.service';
import { UsersController } from './Users.controller';
import { WishModule } from '../wish/Wish.module';
import { PasswordModule } from '../auth/password/password.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), WishModule, PasswordModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

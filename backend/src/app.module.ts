import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/User.entity';
import { Offer } from './offer/entities/Offer.enity';
import { Wish } from './wish/entities/Wish.entity';
import { Wishlist } from './wishlist/entities/Wishlist.entity';
import { UsersModule } from './users/Users.module';
import { WishModule } from './wish/Wish.module';
import { WishlistModule } from './wishlist/Wishlist.module';
import { OfferModule } from './offer/Offer.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'nest_project',
      entities: [User, Offer, Wish, Wishlist],
      synchronize: true,
    }),
    UsersModule,
    WishModule,
    WishlistModule,
    OfferModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

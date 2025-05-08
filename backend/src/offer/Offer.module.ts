import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/Offer.enity';
import { Wish } from '../wish/entities/Wish.entity';
import { OfferController } from './Offer.controller';
import { OfferService } from './Offer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish])],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}

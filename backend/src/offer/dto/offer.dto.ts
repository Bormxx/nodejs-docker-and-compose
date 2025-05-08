import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class OfferDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  @IsBoolean()
  @IsOptional()
  hidden: boolean;
  @IsNotEmpty()
  userId: number;
  @IsNotEmpty()
  itemId: number;
}

export class UpdateOfferDto extends PartialType(OfferDto) {}

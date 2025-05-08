import { PartialType } from '@nestjs/mapped-types';
import {
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class WishDTO {
  @IsString()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;
  @IsUrl()
  @IsNotEmpty()
  link: string;
  @IsUrl()
  @IsNotEmpty()
  image: string;
  @IsDecimal()
  @IsNotEmpty()
  price: number;
  @IsDecimal()
  @IsOptional()
  raised?: number;
  @IsString()
  @Length(1, 1024)
  @IsNotEmpty()
  description: string;
  @IsOptional()
  copied?: number;
}

export class UpdateWishDTO extends PartialType(WishDTO) {}

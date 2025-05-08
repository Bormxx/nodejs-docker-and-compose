import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class WishlistDTO {
  @IsString()
  @Length(1, 250)
  name: string;
  @IsOptional()
  @IsString()
  @Length(1, 1500)
  description?: string;
  @IsOptional()
  @IsUrl()
  image?: string;
  @IsOptional()
  itemsId?: number[];
}

export class UpdateWishlistDTO extends PartialType(WishlistDTO) {}

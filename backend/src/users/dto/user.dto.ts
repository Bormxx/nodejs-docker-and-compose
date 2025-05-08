import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;
  @IsString()
  @Length(2, 200)
  @IsOptional()
  about?: string;
  @IsUrl()
  @IsOptional()
  avatar?: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

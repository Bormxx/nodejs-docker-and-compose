import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { OfferService } from './Offer.service';
import { User } from '../users/entities/User.entity';
import { OfferDto } from './dto/offer.dto';

@Controller('offers')
@UseGuards(JwtGuard)
export class OfferController {
  constructor(private readonly offersService: OfferService) {}
  @Post()
  create(@Req() req: { user: User }, @Body() createOfferDTO: OfferDto) {
    return this.offersService.create(createOfferDTO, req.user);
  }
  @Get()
  findAll() {
    return this.offersService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { WishService } from './Wish.service';
import { User } from '../users/entities/User.entity';
import { WishDTO } from './dto/Wish.dto';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishController {
  constructor(private readonly wishService: WishService) {}
  @Post()
  create(@Req() req: { user: User }, @Body() wishDto: WishDTO) {
    return this.wishService.create(wishDto, req.user);
  }
  @Get('last')
  findLatestWishes() {
    return this.wishService.findLatestWishes();
    // return 'This route uses a wildcard';
  }
  @Get('/top')
  findTopWishes() {
    return this.wishService.findTopWishes();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishService.findOne(+id);
  }
  @Get()
  findAll() {
    return this.wishService.findAll();
  }
  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() wishDto: WishDTO,
    @Req() req: { user: User },
  ) {
    return this.wishService.updateOne(+id, wishDto, req.user);
  }
  @Delete(':id')
  removeOne(@Req() req: { user: User }, @Param('id') id: string) {
    return this.wishService.removeOne(+id, req.user);
  }
  @Post(':id/copy')
  copyWish(@Param('id') id: string, @Req() req: { user: User }) {
    return this.wishService.copyWish(+id, req.user);
  }
}

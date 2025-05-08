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
import { WishlistService } from './Wishlist.service';
import { User } from '../users/entities/User.entity';
import { WishlistDTO } from './dto/Wishlist.dto';

@UseGuards(JwtGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}
  @Post()
  create(@Req() req: { user: User }, @Body() wishlistDTO: WishlistDTO) {
    return this.wishlistService.create(wishlistDTO, req.user);
  }
  @Get()
  findAll() {
    return this.wishlistService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistService.findOne(+id);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: { user: User },
    @Body() wishlistDTO: WishlistDTO,
  ) {
    return this.wishlistService.updateOne(+id, wishlistDTO, req.user);
  }
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: User }) {
    return this.wishlistService.removeOne(+id, req.user);
  }
}

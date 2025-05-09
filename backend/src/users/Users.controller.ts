import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './Users.service';
import { WishService } from '../wish/Wish.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entities/User.entity';
import { PasswordService } from '../auth/password/password.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly wishService: WishService,
    private readonly passwordService: PasswordService,
  ) {}
  @Post()
  create(@Body() createUserDTO: CreateUserDto) {
    return this.userService.create(createUserDTO);
  }
  @Get('me')
  findMe(@Req() req: { user: User }) {
    return this.userService.findMe(req.user.username);
  }
  @Patch('me')
  async updateOne(
    @Req() req: { user: User },
    @Body() updateUserDTO: CreateUserDto,
  ) {
    if ('password' in updateUserDTO) {
      updateUserDTO.password = await this.passwordService.hashPassword(
        updateUserDTO.password,
      );
    }
    return this.userService.updateOne(req.user.id, updateUserDTO);
  }
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.userService.findUserByUsername(username);
  }
  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }
  @Get('me/wishes')
  async findMyWishes(@Req() req: { user: User }) {
    return this.wishService.findUserWishes(req.user);
  }
  @Get(':username/wishes')
  async findWishByUser(@Param('username') username: string) {
    const user = await this.userService.findUserByUsername(username);
    return this.wishService.findUserWishes(user);
  }
  @Post('find')
  async find(@Body() body: { query: string }) {
    return this.userService.findAllByQuery(body.query);
  }
  // @Patch(':id')
  // updateById(@Param('id') id: string, @Body() updateUserDTO: CreateUserDto) {
  //   return this.userService.updateOne(+id, updateUserDTO);
  // }
  // @Delete(':id')
  // removeOne(@Param('id') id: string) {
  //   return this.userService.removeOne(+id);
  // }
}

import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/user.dto';
import { LocalGuard } from './guards/local.guard';
import { User } from '../users/entities/User.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // Регистрация пользователя
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }
  // Авторизация пользователя
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Request() req: { user: User }) {
    return await this.authService.login(req.user);
  }
}

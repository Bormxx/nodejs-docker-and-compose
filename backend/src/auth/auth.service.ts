import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/Users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/user.dto';
import { User } from '../users/entities/User.entity';
import { PasswordService } from './password/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  // Регистрация пользователя
  async signup(createUserDto: CreateUserDto) {
    const hashedPassword = await this.passwordService.hashPassword(
      createUserDto.password,
    );
    const { ...user } = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const result = {
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
    return result;
  }
  // Метод для генерации токена пользователя
  async login(user: User) {
    const payload = { username: user.username, userId: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  // Реализация метода проверки пользователя по имени пользователя и паролю
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findUserForLogin(username);
    if (
      user &&
      (await this.passwordService.verifyPassword(user.password, password))
    ) {
      return user;
    }
    return null;
  }
}

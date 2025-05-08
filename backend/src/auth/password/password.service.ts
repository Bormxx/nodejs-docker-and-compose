import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  // Метод для хеширования пароля пользователя
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
  // Метод для проверки пароля пользователя
  async verifyPassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

import { Module } from '@nestjs/common';
import { UsersModule } from '../users/Users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { PasswordModule } from './password/password.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '3d',
      },
    }),
    PasswordModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}

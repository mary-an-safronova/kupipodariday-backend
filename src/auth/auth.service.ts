import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { BcryptService } from './bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private bcryptService: BcryptService,
  ) {}

  auth(user: User) {
    // Генерируем токен
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByName(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const comparePassword = await this.bcryptService.comparePasswords(
      password,
      user.password,
    );

    if (!comparePassword)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}

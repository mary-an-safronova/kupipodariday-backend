import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from './bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  auth(user: User) {
    // Генерируем токен
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string): Promise<User> {
    // Получаем пользователя по имени вместе с полем пароля
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();

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

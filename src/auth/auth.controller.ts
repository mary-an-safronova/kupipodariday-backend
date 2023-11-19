import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { BcryptService } from './bcrypt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private bcryptService: BcryptService,
  ) {}

  // Стратегия local автоматически достанет username и password из тела запроса
  // Если пароль будет верным, данные пользователя окажутся в объекте req.user
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req) {
    // Генерируем для пользователя JWT-токен
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = await this.bcryptService.hashPassword(
      createUserDto.password,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = createUserDto;
    // При регистрации создаём пользователя
    const user = await this.usersService.create({
      password: hashedPassword,
      ...rest,
    });
    // и генерируем для него токен
    return this.authService.auth(user);
  }
}

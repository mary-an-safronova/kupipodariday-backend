import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  // Авторизация пользователя
  // Стратегия local автоматически достанет username и password из тела запроса
  // Если пароль будет верным, данные пользователя окажутся в объекте req.user
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req) {
    // Генерируем для пользователя JWT-токен
    return this.authService.auth(req.user);
  }

  // Регистрация пользователя
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }
}

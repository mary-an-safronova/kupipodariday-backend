import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

class LoginResponse {
  // Создаем класс для определения формата ответа
  @ApiProperty({ example: 'random-string', description: 'JWT Access Token' })
  access_token: string;
}

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  // Авторизация пользователя
  // Стратегия local автоматически достанет username и password из тела запроса
  // Если пароль будет верным, данные пользователя окажутся в объекте req.user
  @ApiOkResponse({ type: LoginResponse })
  @ApiUnauthorizedResponse({ description: 'Некорректная пара логин и пароль' })
  @UseGuards(LocalGuard)
  @Post('signin')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'exampleuser' },
        password: { type: 'string', example: 'somestrongpassword' },
      },
    },
  })
  async signin(@Req() req) {
    // Генерируем для пользователя JWT-токен
    return this.authService.auth(req.user);
  }

  // Регистрация пользователя
  @ApiCreatedResponse({ type: User })
  @ApiConflictResponse({
    description: 'Пользователь с таким email или username уже зарегистрирован',
  })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }
}

import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { BcryptService } from 'src/auth/bcrypt.service';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private bcryptService: BcryptService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('/me')
  async getMe(@Req() req) {
    const user = req.user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = await this.usersService.findOne(user.id);
    return rest;
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Post('/find')
  async findMany(@Body() query: SearchUserDto) {
    const users = await this.usersService.findMany(query);
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    });
  }

  @UseGuards(JwtGuard)
  @Patch('/me')
  async updateOne(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;

    // Хеширование пароля при его обновлении
    if (updateUserDto.password) {
      const hashedPassword = await this.bcryptService.hashPassword(
        updateUserDto.password,
      );
      updateUserDto.password = hashedPassword;
    }

    // Обновляем данные пользователя
    await this.usersService.updateOne(userId, updateUserDto);
    // Получаем обновленные данные
    const updatedUser = await this.usersService.findOne(userId);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = updatedUser;
    // Возвращаем обновленные данные, исключив пароль
    return rest;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    await this.usersService.removeById(id);
  }
}

import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
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
import { WishesService } from 'src/wishes/wishes.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private bcryptService: BcryptService,
    private wishesService: WishesService,
  ) {}

  // Получаем информацию о себе
  @UseGuards(JwtGuard)
  @Get('/me')
  async getMe(@Req() req) {
    const user = req.user;
    return await this.usersService.findOne(user.id);
  }

  // Получаем всех пользователей
  @UseGuards(JwtGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Получаем пользователя по имени
  @UseGuards(JwtGuard)
  @Get(':username')
  async findOneByName(@Param('username') username: string) {
    return await this.usersService.findOneByName(username);
  }

  // Находим пользователя в поиске по почте или имени
  @UseGuards(JwtGuard)
  @Post('/find')
  async findMany(@Body() query: SearchUserDto) {
    return await this.usersService.findMany(query);
  }

  // Изменяем информацию о себе
  @UseGuards(JwtGuard)
  @Patch('/me')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(req.user.id, updateUserDto);
  }

  // Получаем все свои пожелания
  @UseGuards(JwtGuard)
  @Get('/me/wishes')
  getMyWishes(@Req() req) {
    return this.wishesService.findUserWishes(req.user.id);
  }

  // Получаем пожелания пользователя по его имени
  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async getUsernameWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findOneByName(username);
    return this.wishesService.findUserWishes(id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.removeById(id);
  }
}

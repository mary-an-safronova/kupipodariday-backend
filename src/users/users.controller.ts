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
import { SearchUserDto } from './dto/search-user.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Wish } from 'src/wishes/entities/wish.entity';

@ApiTags('Users')
@UseGuards(JwtGuard) // Гард JwtGuard применен ко всем методам контроллера
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  // Получаем информацию о себе
  @ApiOkResponse({ type: User })
  @Get('/me')
  async getMe(@Req() req) {
    return await this.usersService.findOne(req.user.id);
  }

  // Получаем всех пользователей
  @ApiOkResponse({ type: [User] })
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Получаем пользователя по имени
  @ApiOkResponse({ type: User })
  @Get(':username')
  async findOneByName(@Param('username') username: string) {
    return await this.usersService.findOneByName(username);
  }

  // Находим пользователя в поиске по почте или имени
  @ApiOkResponse({ type: User })
  @Post('/find')
  async findMany(@Body() query: SearchUserDto) {
    return await this.usersService.findMany(query);
  }

  // Изменяем информацию о себе
  @ApiOkResponse({ type: User })
  @Patch('/me')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(req.user.id, updateUserDto);
  }

  // Получаем все свои пожелания
  @ApiOkResponse({ type: [Wish] })
  @Get('/me/wishes')
  getMyWishes(@Req() req) {
    return this.wishesService.findUserWishes(req.user.id);
  }

  // Получаем пожелания пользователя по его имени
  @ApiOkResponse({ type: [Wish] })
  @Get(':username/wishes')
  async getUsernameWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findOneByName(username);
    return this.wishesService.findUserWishes(id);
  }

  @ApiOkResponse({ description: 'Пользователь успешно удален' })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.removeById(id);
  }
}

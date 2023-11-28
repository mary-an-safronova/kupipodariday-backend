import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard) // Гард JwtGuard применен ко всем методам контроллера
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  // Создание вишлиста
  @Post()
  create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  // Получение всех вишлистов
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  // Получение вишлиста по id
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  // Изменение своего вишлиста по id
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(req.user, id, updateWishlistDto);
  }

  // Удаление вишлиста по id
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    return await this.wishlistsService.remove(req.user.id, id);
  }
}

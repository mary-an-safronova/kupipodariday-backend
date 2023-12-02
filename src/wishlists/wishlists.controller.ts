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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Wishlist } from './entities/wishlist.entity';

@ApiTags('Wishlistlists')
@UseGuards(JwtGuard) // Гард JwtGuard применен ко всем методам контроллера
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  // Создание вишлиста
  @ApiCreatedResponse({ type: Wishlist })
  @Post()
  create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  // Получение всех вишлистов
  @ApiOkResponse({ type: [Wishlist] })
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  // Получение вишлиста по id
  @ApiOkResponse({ type: Wishlist })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  // Изменение своего вишлиста по id
  @ApiOkResponse({ type: Wishlist })
  @ApiBadRequestResponse({
    description: 'Можно изменять только свои списки пожеланий',
  })
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(req.user, id, updateWishlistDto);
  }

  // Удаление вишлиста по id
  @ApiOkResponse({ description: 'Вишлист успешно удален' })
  @ApiBadRequestResponse({
    description: 'Можно удалять только свои списки пожеланий',
  })
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    return await this.wishlistsService.remove(req.user.id, id);
  }
}

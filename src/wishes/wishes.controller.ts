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
  BadRequestException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  // Создание пожелания
  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user, createWishDto);
  }

  // Получение всех пожеланий
  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  // Получение 40 последних пожеланий
  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  // Получение последних 20 самых популярных пожеланий
  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  // Получение пожелания по его id
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  // Изменение пожелания
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWish(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    const wish = await this.wishesService.findOne(id);
    if (wish.owner.id !== req.user.id) {
      throw new BadRequestException('Можно изменять только свои пожелания');
    }
    await this.wishesService.update(id, updateWishDto);
    const updatedWish = await this.wishesService.findOne(id);
    return updatedWish;
  }

  // Удаление своего пожелания
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    const wish = await this.wishesService.findOne(id);
    if (wish.owner.id !== req.user.id) {
      throw new BadRequestException('Можно удалять только свои пожелания');
    }
    return await this.wishesService.remove(+id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Req() req, @Param('id') id: number) {
    const wish = await this.wishesService.findOne(id);
    await this.wishesService.update(id, { copied: wish.copied + 1 });
    const { name, link, image, price, description } = wish;
    return this.wishesService.create(req.user, {
      name,
      link,
      image,
      price,
      description,
    });
  }
}

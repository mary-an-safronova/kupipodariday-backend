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
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Offer } from './entities/offer.entity';

@ApiTags('Offers')
@UseGuards(JwtGuard) // Гард JwtGuard применен ко всем методам контроллера
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // Создание оффера
  @ApiCreatedResponse({ type: Offer })
  @ApiNotFoundResponse({ description: 'Пожелание не найдено' })
  @ApiBadRequestResponse({
    description: 'Сумма собранных средств не может превышать стоимость подарка',
  })
  @Post()
  create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(req.user, createOfferDto);
  }

  // Получение всех офферов
  @ApiOkResponse({ type: [Offer] })
  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  // Получение оффера по id
  @ApiOkResponse({ type: Offer })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.offersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(+id, updateOfferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.offersService.remove(+id);
  }
}

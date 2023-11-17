import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  create(createOfferDto: CreateOfferDto) {
    return this.offerRepository.save(createOfferDto);
  }

  findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOneBy({ id });
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    const offer = this.findOne(id);
    if (!offer) {
      throw new NotFoundException('Заявка не найдена');
    }
    return this.offerRepository.update({ id }, updateOfferDto);
  }

  remove(id: number) {
    return this.offerRepository.delete({ id });
  }
}

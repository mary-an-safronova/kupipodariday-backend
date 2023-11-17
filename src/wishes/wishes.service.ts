import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto) {
    return this.wishRepository.save(createWishDto);
  }

  findAll(): Promise<Wish[]> {
    return this.wishRepository.find();
  }

  findOne(id: number): Promise<Wish> {
    return this.wishRepository.findOneBy({ id });
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    const wish = this.findOne(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return this.wishRepository.update({ id }, updateWishDto);
  }

  remove(id: number) {
    return this.wishRepository.delete({ id });
  }
}

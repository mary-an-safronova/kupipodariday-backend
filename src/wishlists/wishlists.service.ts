import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  create(createWishlistDto: CreateWishlistDto) {
    return this.wishlistRepository.save(createWishlistDto);
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find();
  }

  findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOneBy({ id });
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException('Список подарков не найден');
    }
    return this.wishlistRepository.update({ id }, updateWishlistDto);
  }

  remove(id: number) {
    return this.wishlistRepository.delete({ id });
  }
}

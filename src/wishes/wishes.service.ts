import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  create(owner: User, createWishDto: CreateWishDto) {
    return this.wishRepository.save({ owner, ...createWishDto });
  }

  findAll(): Promise<Wish[]> {
    return this.wishRepository.find();
  }

  findOne(id: number) {
    return this.wishRepository.findOne({
      relations: {
        owner: true,
      },
      where: { id },
    });
  }

  findUserWishes(id: number) {
    return this.wishRepository.find({
      where: { owner: { id } },
    });
  }

  findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: { owner: true },
    });
  }

  findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
      relations: { owner: true },
    });
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return this.wishRepository.update(
      { id },
      { updatedAt: new Date(), ...updateWishDto },
    );
  }

  remove(id: number) {
    return this.wishRepository.delete({ id });
  }
}

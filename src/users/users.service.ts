import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByName(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  updateOne(id: number, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return this.userRepository.update({ id }, updateUserDto);
  }

  removeById(id: number) {
    return this.userRepository.delete({ id });
  }
}

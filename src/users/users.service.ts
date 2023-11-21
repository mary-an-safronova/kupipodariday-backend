import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByName(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findMany({ query }: SearchUserDto) {
    return this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  updateOne(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(
      { id },
      { updatedAt: new Date(), ...updateUserDto },
    );
  }

  removeById(id: number) {
    return this.userRepository.delete({ id });
  }
}

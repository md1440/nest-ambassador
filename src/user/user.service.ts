import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async save(options) {
    return this.userRepository.save(options);
  }

  async find(email: string) {
    return this.userRepository.find({ email });
  }

  async findOne(options) {
    return this.userRepository.findOne(options);
  }

  async update(id: number, options: Partial<User>) {
    const user = await this.userRepository.findOne(id);

    Object.assign(user, options);

    return this.userRepository.save(user);
  }
}

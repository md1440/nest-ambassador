import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

export abstract class AbstractService {
  protected constructor(protected readonly repository: Repository<any>) {}

  async save(options) {
    return this.repository.save(options);
  }

  async find(options) {
    return this.repository.find(options);
  }

  async findOne(options) {
    return this.repository.findOne(options);
  }

  async update(id: number, options: Partial<User | Product>) {
    const user = await this.repository.findOne(id);

    Object.assign(user, options);

    return this.repository.save(user);
  }
}

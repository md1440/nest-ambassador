import { Repository } from 'typeorm';
import { ProductCreateDto } from '../product/dtos/product-create.dto';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

export abstract class AbstractService {
  protected constructor(protected readonly repository: Repository<any>) {}

  async save(options) {
    return this.repository.save(options);
  }

  async find(options = {}) {
    return this.repository.find(options);
  }

  async findOne(options) {
    return this.repository.findOne(options);
  }

  async update(
    id: number,
    options: Partial<User | Product | ProductCreateDto>,
  ) {
    const user = await this.repository.findOne(id);

    Object.assign(user, options);

    return this.repository.save(user);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}

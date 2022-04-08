import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Get('admin/products')
  async getAll() {
    return this.productService.find();
  }

  @UseGuards(AuthGuard)
  @Post('admin/products')
  async create(@Body() body: ProductCreateDto) {
    return this.productService.save(body);
  }

  @UseGuards(AuthGuard)
  @Get('admin/products/:id')
  async get(@Param('id') id: number) {
    return this.productService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Patch('admin/products/:id')
  async update(
    @Param('id') id: number,
    @Body() body: Partial<ProductCreateDto>,
  ) {
    await this.productService.update(id, body);

    return this.productService.find({ id });
  }

  @UseGuards(AuthGuard)
  @Delete('admin/products/:id')
  async delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}

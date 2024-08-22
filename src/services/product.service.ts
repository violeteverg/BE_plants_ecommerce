import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from 'src/dto/product/product.dto';
import { UpdateProductDto } from 'src/dto/product/updateProduct.dto';
import { paginate } from 'src/helpers/paginationHelper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  //create Product
  async createProduct(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        ...createProductDto,
        categoryId: parseInt(createProductDto.categoryId),
        price: parseInt(createProductDto.price),
        quantity: parseInt(createProductDto.quantity),
      },
      include: { category: true, discount: true },
    });
  }
  //get search Product
  async searchProducts(query: string, page: number, limit: number) {
    const product = await this.prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
        quantity: {
          gt: 0,
        },
      },
    });
    const { data, pagination } = paginate(product, page, limit);

    return {
      data,
      pagination,
    };
  }
  //get all product
  async findAll(page: number, limit: number) {
    const product = await this.prisma.product.findMany({
      where: { quantity: { gt: 0 } },
      orderBy: {
        id: 'asc',
      },
      include: { category: true, discount: true },
    });
    const { data, pagination } = paginate(product, page, limit);

    return {
      data,
      pagination,
    };
  }
  async findAllWithSearch(page: number, limit: number, query: string) {
    const product = await this.prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        AND: [{ quantity: { gt: 0 } }],
      },
      orderBy: {
        id: 'asc',
      },
      include: { category: true, discount: true },
    });
    const { data, pagination } = paginate(product, page, limit);

    return {
      data,
      pagination,
    };
  }

  //get product by category
  async findByCategories(categoryName: string, page: number, limit: number) {
    const product = await this.prisma.product.findMany({
      where: { category: { categoryName } },
      orderBy: { id: 'asc' },
      include: { category: true, discount: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${categoryName} not found`);
    }
    const { data, pagination } = paginate(product, page, limit);

    return {
      data,
      pagination,
    };
  }

  //get product by id
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, discount: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }
  //update product
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`product with id ${id} not found`);
    }
    return await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        categoryId: parseInt(updateProductDto.categoryId),
        price: parseInt(updateProductDto.price),
        quantity: parseInt(updateProductDto.quantity),
      },
      include: { category: true, discount: true },
    });
  }
  //update quantity
  async updateQuantity(id: number, newQuantity: number) {
    return await this.prisma.product.update({
      where: { id },
      data: { quantity: newQuantity },
    });
  }
  // update quantity
  async reduceProductQuantity(
    productId: number,
    quantityToReduce: number,
  ): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    if (product.quantity < quantityToReduce) {
      throw new Error(`Insufficient quantity for product ID ${productId}`);
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: { quantity: product.quantity - quantityToReduce },
    });
  }

  // Update quantity for multiple products
  async reduceMultitpleProductQuantity(
    products: { productId: number; quantity: number }[],
  ): Promise<void> {
    for (const product of products) {
      await this.reduceProductQuantity(product.productId, product.quantity);
    }
  }
  //delete Product
  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`product with id ${id} not found`);
    }
    return await this.prisma.product.delete({ where: { id } });
  }
}

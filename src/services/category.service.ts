import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from 'src/dto/category/category.dto';
import { UpdateCategoryDto } from 'src/dto/category/updateCategory.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  //Get all Category
  async findAll() {
    return await this.prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
  //Get Category by ID
  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ${id} not found`);
    }
    return category;
  }
  //Create Category
  async createCategory(createCategoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({ data: createCategoryDto });
  }
  //Update Category
  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    const update = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    console.log(update);
    if (!category) {
      throw new NotFoundException(`category with ${id} not found`);
    }
    return update;
  }
  //delete Category
  async removeCategory(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`category with ${id} not found`);
    }
    return await this.prisma.category.delete({ where: { id } });
  }
}

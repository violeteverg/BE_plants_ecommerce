import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateCategoryDto } from 'src/dto/category/category.dto';
import { UpdateCategoryDto } from 'src/dto/category/updateCategory.dto';
import { CategoryService } from 'src/services/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // get all category
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
  // get category by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }
  // create category
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }
  //update category
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const update = await this.categoryService.updateCategory(
        +id,
        updateCategoryDto,
      );
      console.log(update, '<===');
      return res.send({ message: 'hehe' });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
  //delete category
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.categoryService.removeCategory(+id);
      res.send({ message: `this id ${id} already disapear` });
    } catch (error) {
      return res.send(error);
    }
  }
}

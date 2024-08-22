import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CreateProductDto } from 'src/dto/product/product.dto';
import { UpdateProductDto } from 'src/dto/product/updateProduct.dto';
import { ResponseHelper } from 'src/helpers/responseHelper';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { ProductService } from 'src/services/product.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly responseHelper: ResponseHelper,
  ) {}
  //create product
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      if (file) {
        const result = await this.cloudinaryService.uploadImage(file);
        createProductDto.image = result.secure_url;
      }
      const product = await this.productService.createProduct(createProductDto);

      return this.responseHelper.responseSuccessData(
        res,
        HttpStatus.CREATED,
        'Product created successfully',
        product,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(res, error);
    }
  }
  //get search product
  @Get('search')
  async searchProduct(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
  ) {
    try {
      const products = await this.productService.searchProducts(
        query,
        +page,
        +limit,
      );
      return this.responseHelper.responseSuccessData(
        res,
        HttpStatus.OK,
        `Products ${query} retrivied successfully`,
        products,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(res, error);
    }
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Res() res: Response,
  ) {
    try {
      const products = await this.productService.findAll(+page, +limit);
      return this.responseHelper.responseSuccessData(
        res,
        HttpStatus.OK,
        'Products retrieved successfully',
        products.data,
        products.pagination,
      );
    } catch (error) {
      return this.responseHelper.responseServerError(res, error);
    }
  }

  //get query with search
  // @Get()
  // async findAll(
  //   @Query('page') page = 1,
  //   @Query('limit') limit = 20,
  //   @Query('search') query: string,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const products = await this.productService.findAllWithSearch(
  //       +page,
  //       +limit,
  //       query,
  //     );
  //     return this.responseHelper.responseSuccessData(
  //       res,
  //       HttpStatus.OK,
  //       'Products retrieved successfully',
  //       products.data,
  //       products.pagination,
  //     );
  //   } catch (error) {
  //     return this.responseHelper.responseServerError(res, error);
  //   }
  // }
  //get product by id
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    try {
      const product = await this.productService.findOne(+id);
      this.responseHelper.responseSuccessData(
        res,
        HttpStatus.OK,
        'Product retrieved successfully',
        [product],
      );
    } catch (error) {
      this.responseHelper.responseServerError(res, error);
    }
  }
  //get product by category name
  @Get('category/:categoryName')
  async cactus(
    @Param('categoryName') categoryName: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Res() res: Response,
  ) {
    try {
      const products = await this.productService.findByCategories(
        categoryName,
        +page,
        +limit,
      );
      this.responseHelper.responseSuccessData(
        res,
        HttpStatus.OK,
        'Products retrieved successfully',
        products.data,
        products.pagination,
      );
    } catch (error) {
      this.responseHelper.responseServerError(res, error);
    }
  }
  //update product
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      if (file) {
        const result = await this.cloudinaryService.uploadImage(file);
        updateProductDto.image = result.secure_url;
      }
      await this.productService.update(+id, updateProductDto);
      return res.send({ message: `product with id ${id} already updated` });
    } catch (error) {
      return res.send({ error: error });
    }
  }
  //delete product
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.productService.remove(+id);
      return res.send({ message: `this product already disapearrrrrr` });
    } catch (error) {
      return res.send({ error: error });
    }
  }
}

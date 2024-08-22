import { Module } from '@nestjs/common';
import { ProductController } from 'src/controllers/product.controllers';
import { ResponseHelper } from 'src/helpers/responseHelper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { ProductService } from 'src/services/product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, CloudinaryService, ResponseHelper],
})
export class ProductModule {}

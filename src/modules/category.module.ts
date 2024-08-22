import { Module } from '@nestjs/common';
import { CategoryController } from 'src/controllers/category.controllers';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryService } from 'src/services/category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
})
export class CategoryModule {}

// src/features/image/image.module.ts
import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageRepository } from './image.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CloudinaryService } from '@/shared/cloudinary/cloudinary.service';

@Module({
  providers: [
    ImageService,
    ImageRepository,
    PrismaService,
    CloudinaryService,
  ],
  exports: [ImageService], // Export để các feature khác sử dụng
})
export class ImageModule {}
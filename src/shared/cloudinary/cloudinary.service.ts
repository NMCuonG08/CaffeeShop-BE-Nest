import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import cloudinary from './cloudinary.config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CloudinaryService {

  constructor(private readonly prismaService: PrismaService) {
  }

  async uploadImage(file: Express.Multer.File) {
    const uploadApiResponse: UploadApiResponse = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'caffee',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload failed, no result returned"));
          resolve(result);
        },
      );
      upload.end(file.buffer);
    });

    if (uploadApiResponse) {
      const image = this.prismaService.image.create({
        data: {
          url: uploadApiResponse.secure_url,
          publicId: uploadApiResponse.public_id,
          createdAt: new Date(uploadApiResponse.created_at)
        }
      })
      return image
    }

    return null;
  }

  async deleteImage(imageId: number) {
    const image =await this.prismaService.image.findUnique({
      where: {
        id: imageId
      },
      select: {
        publicId: true
      }
    })
    if (!image) return null;
    return cloudinary.uploader.destroy(image.publicId);
  }

  async getImageUrl(imageId :number) {
    const image = await this.prismaService.image.findUnique({
      where: {
        id: imageId,
      }
    })
    if (!image) return null;
    return image.url;
  }

}

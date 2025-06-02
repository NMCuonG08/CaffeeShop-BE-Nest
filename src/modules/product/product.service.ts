import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from "src/shared/prisma/prisma.service";
import { AddNewProductDto, ProductResponseDto } from './dto';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service';
import { mapProductToResponse } from '../../mapper/product.mapper';



@Injectable({})
export class ProductService {
    constructor(private prisma : PrismaService, private readonly cloudinaryService: CloudinaryService) {}

    async getProductById(id: number): Promise<ProductResponseDto | null> {
        const product = await this.prisma.product.findUnique({
            where: { product_id: id },
        });
        if (!product) return null;
        const imageUrl = product.imageId
          ? await this.cloudinaryService.getImageUrl(product.imageId)
          : undefined;
        return mapProductToResponse(product, imageUrl ?? undefined);
    }



    async getAllProducts({ page, limit, }: {
        page: number;
        limit: number;
    }): Promise<{ products: ProductResponseDto[]; total: number }> {
        const products = await this.prisma.product.findMany({
            skip: (page - 1) * limit,
            take: limit,
          orderBy: {
            product_id: 'desc',
          },
        });

        const total = await this.prisma.product.count();

        // get all image id
        const imageIds = Array.from(
          new Set(products.map(p => p.imageId).filter(id => id !== null))
        );

        const images = await this.prisma.image.findMany({
            where: {
                id: { in: imageIds as number[] },
            },
        });

        const imageMap = new Map<number, string>();
        for (const img of images) {
            imageMap.set(img.id, img.url);
        }

        const result: ProductResponseDto[] = products.map((product) =>
          mapProductToResponse(product, product.imageId ? imageMap.get(product.imageId) : undefined)
        );

        return {
            products: result,
            total,
        };
    }

    async addNewProduct(product: AddNewProductDto, file?: Express.Multer.File) {
        let image_cover: number | undefined = undefined;

        if (file) {
            const uploaded = await this.cloudinaryService.uploadImage(file);
            if (uploaded) {
                image_cover = uploaded.id;
            }
        }

        // Tạo object data cơ bản
        const data: any = {
            ...product,
        };

        // Nếu có image_cover thì thêm vào data
        if (image_cover) {
            data.product_image_cover = {
                connect: { id: image_cover },
            };
        }

        const newProduct = await this.prisma.product.create({
            data: data,
        });

        return newProduct;
    }


  async updateProduct(
    id: number,
    product: AddNewProductDto,
    file?: Express.Multer.File
  ): Promise<ProductResponseDto> {
    const thisProduct = await this.prisma.product.findUnique({
      where: { product_id: id },
    });

    if (!thisProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const oldImageId = thisProduct.imageId;
    let newImageId: number | undefined;

    // 1. Upload ảnh mới nếu có
    if (file) {
      try {
        const uploaded = await this.cloudinaryService.uploadImage(file);
        if (!uploaded?.id) {
          throw new Error('Cloudinary upload failed');
        }
        newImageId = uploaded.id;
      } catch (err) {
        throw new InternalServerErrorException('Failed to upload image');
      }
    }

    // 2. Cập nhật DB trong transaction
    try {
      await this.prisma.$transaction(async (tx) => {
        const updateData: any = {
          ...product,
        };

        if (newImageId) {
          updateData.product_image_cover = {
            connect: { id: newImageId },
          };
        }

        await tx.product.update({
          where: { product_id: id },
          data: updateData,
        });
      });
    } catch (err) {
      // Nếu lỗi, rollback + xoá ảnh mới nếu có
      if (newImageId) {
        try {
          await this.cloudinaryService.deleteImage(newImageId);
        } catch (e) {
          console.warn('Rollback failed to delete new image:', e);
        }
      }
      throw err;
    }

    // 3. Xóa ảnh cũ sau khi DB update thành công
    if (newImageId && oldImageId) {
      try {
        await this.cloudinaryService.deleteImage(oldImageId);
      } catch (e) {
        console.warn('Failed to delete old image from Cloudinary:', e);
      }
    }

    // 4. Trả về dữ liệu mới
    const updatedProduct = await this.prisma.product.findUnique({
      where: { product_id: id },
    });

    const imageUrl = updatedProduct?.imageId
      ? await this.cloudinaryService.getImageUrl(updatedProduct.imageId)
      : undefined;

    return mapProductToResponse(updatedProduct!, imageUrl??undefined);
  }


  async  deleteProduct(id : number) {
        try {


          await this.prisma.$transaction(async (tx) => {
            const product = await this.prisma.product.findUnique({
              where: {
                product_id : id
              }
            })
            if (!product) {
              return;
            }

            if(product.imageId){
              try {
                await this.cloudinaryService.deleteImage(product.imageId);
              } catch (e) {
                console.warn('Failed to delete old image from Cloudinary:', e);
              }
            }
            await tx.product.delete({
              where:{
                product_id : id
              }
            })

          })
        }
        catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


}
// product.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AddNewProductDto } from './dto';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.product.findUnique({
      where: { product_id: id },
      include: {
        product_image_cover: {
          select: { id: true, url: true }
        }
      }
    });
  }

  async findManyWithPagination(page: number, limit: number, orderBy: any,category?:string,priceFilter?,search?:string) {
    return this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        stock: { gt: 0 },
        ...(category && { product_category: category }),
        ...priceFilter,
        ...(search && {
          OR: [
            {
              product: {
                contains: search,

              }
            },
            {
              product_description: {
                contains: search,
              }
            }
          ]
        })
      },

      include: {
        product_image_cover: {
          select: { id: true, url: true }
        }
      },
      orderBy,
    });
  }


  async countInStock(category?: string,priceFilter?,search?:string) {
    return this.prisma.product.count({
      where: {
        stock: { gt: 0 },
        ...(category && { product_category: category }),
        ...priceFilter,
        ...(search && {
          OR: [
            {
              product: {
                contains: search,

              }
            },
            {
              product_description: {
                contains: search,

              }
            }
          ]
        })
      }
    });
  }

  async findCheapest(limit: number) {
    return this.prisma.product.findMany({
      take: limit,
      orderBy: {
        current_retail_price: 'asc',
      },
      where: {
        stock: { gt: 0 }
      },
      include: {
        product_image_cover: {
          select: { id: true, url: true }
        }
      },
    });
  }

  async create(data: AddNewProductDto) {
    return this.prisma.product.create({ data });
  }

  async update(id: number, data: AddNewProductDto) {
    return this.prisma.product.update({
      where: { product_id: id },
      data
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({
      where: { product_id: id }
    });
  }

  async executeTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(callback);
  }
}
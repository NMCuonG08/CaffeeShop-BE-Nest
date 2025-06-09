import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { PrismaService } from '@/shared/prisma';

@Injectable()
export class ProductLoader {
  constructor(private prisma: PrismaService) {}

  createLoader() {
    return new DataLoader(async (productIds: number[]) => {
      const products = await this.prisma.product.findMany({
        where: { product_id: { in: productIds } }
      });

      return productIds.map(id =>
        products.find(product => product.product_id === id)
      );
    });
  }
}
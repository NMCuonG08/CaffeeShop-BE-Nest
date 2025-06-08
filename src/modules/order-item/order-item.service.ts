import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma';
import { OrderItem } from '@prisma/client';

@Injectable()
export class OrderItemService {

  constructor(private readonly prismaService: PrismaService) {
  }

  async getOrderItem(orderId: number): Promise<OrderItem> {
    const orderItem = await this.prismaService.orderItem.findUnique({
      where: {
        id: orderId,
      },
      include: {
        order: true,
        product: true,
      },

    });

    if (!orderItem) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return orderItem;
  }


}
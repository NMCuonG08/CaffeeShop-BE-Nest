import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma';
import { CreateOrderInput } from '@/modules/order/dto/create-input.order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderInput: CreateOrderInput) {
    const { items, ...orderData } = createOrderInput;

    // Validate items
    await this.validateOrderItems(items);

    // Calculate total amount
    const { totalAmount, itemsWithPrices } = await this.calculateOrderTotal(items);

    // Create order with items in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          ...orderData,
          totalAmount,
          status: 'pending'
        }
      });

      // Create order items
      await Promise.all(
        itemsWithPrices.map(item =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity
            }
          })
        )
      );

      // Update product stock
      await Promise.all(
        items.map(item =>
          tx.product.update({
            where: { product_id: item.productId },
            data: { stock: { decrement: item.quantity } }
          })
        )
      );

      // Return complete order
      return tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          items: { include: { product: true } },
          user: true,
          userInfo: true
        }
      });
    });

    return order;
  }

  async findAll(filters: {
    userId?: number;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const { userId, status, limit = 20, offset = 0 } = filters;

    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    return this.prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        user: true,
        userInfo: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: true,
        userInfo: true
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: number, status: string) {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid order status');
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } },
        user: true,
        userInfo: true
      }
    });

    return order;
  }

  async cancel(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status === 'cancelled') {
        throw new BadRequestException('Order already cancelled');
      }

      if (['shipped', 'delivered'].includes(order.status)) {
        throw new BadRequestException('Cannot cancel shipped/delivered order');
      }

      // Restore product stock
      await Promise.all(
        order.items.map(item =>
          tx.product.update({
            where: { product_id: item.productId },
            data: { stock: { increment: item.quantity } }
          })
        )
      );

      // Update status
      return tx.order.update({
        where: { id },
        data: { status: 'cancelled' },
        include: {
          items: { include: { product: true } },
          user: true,
          userInfo: true
        }
      });
    });
  }

  private async validateOrderItems(items: { productId: number; quantity: number }[]) {
    const productIds = items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { product_id: { in: productIds } }
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('Some products not found');
    }

    for (const item of items) {
      const product = products.find(p => p.product_id === item.productId);
     if(product) {
       if (product.stock < item.quantity) {
         throw new BadRequestException(`Not enough stock for ${product.product}`);
       }
     }
    }
  }

  private async calculateOrderTotal(items: { productId: number; quantity: number }[]) {
    const productIds = items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: { product_id: { in: productIds } }
    });

    let totalAmount = 0;
    const itemsWithPrices = items.map(item => {
      const product = products.find(p => p.product_id === item.productId);
      if (product && product.current_wholesale_price) {
        const itemTotal = (product?.current_retail_price ? product?.current_retail_price : product.current_wholesale_price ) * item.quantity;
        totalAmount += itemTotal;
      }
      return { ...item, unitPrice: product?.current_retail_price };
    });

    return { totalAmount, itemsWithPrices };
  }
}
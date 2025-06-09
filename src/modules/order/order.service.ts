import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma';
import { CreateOrderInput } from '@/modules/order/dto/create-input.order.dto';
import { OrderStatus } from '@/shared/types/order.type';

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
          status: OrderStatus.PENDING
        }
      });

      // Create order items
      await Promise.all(
        itemsWithPrices.map(item =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
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
          user: true
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

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                product_image_cover : true
              }
            }
          }
        },
        user: {
          include: {
            userInfos: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    return orders.map(order => {
      const firstUserInfo = order.user?.userInfos?.[0] || null;

      return {
        ...order,
        items: order.items.map(item => ({
          ...item,
          product: {
            ...item.product,
            image: item.product?.product_image_cover?.url || null
          }
        })),
        user: {
          ...order.user,
          userInfo: firstUserInfo
        }
      };
    });
  }


  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: id },
      include: {
        items: { include: { product: true } },
        user: { include: { userInfos: true } }
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Lấy userInfo đầu tiên nếu có
    const firstUserInfo = order.user?.userInfos?.[0] || null;

    return {
      ...order,
      user: {
        ...order.user,
        userInfo: firstUserInfo
      }
    };
  }


  async updateStatus(id: number, status: OrderStatus) {
    const validStatuses = Object.values(OrderStatus);

    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid order status');
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } },
        user: true,
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

      if (order.status === OrderStatus.CANCELLED) {
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
        data: { status: OrderStatus.CANCELLED },
        include: {
          items: { include: { product: true } },
          user: true,
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

  async getAllStatusNumber(id:number){
    const grouped = await this.prisma.order.groupBy({
      where: {
        userId: id
      },
      by: ['status'],
      _count: { status: true },
    });
    const orderStats = {
      ALL: 0,
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      SHIPPING: 0,
      DELIVERED: 0,
      CANCELLED: 0
    };
    grouped.forEach(group => {
      const status = group.status as keyof typeof orderStats;
      if (orderStats[status] !== undefined) {
        orderStats[status] = group._count.status;
        orderStats.ALL += group._count.status;
      }
    });
    return orderStats;
  }
}


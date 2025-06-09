import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma';
import { Order } from '@prisma/client';


@Injectable()
export class UserService{
  constructor(private readonly prismaService: PrismaService) {
  }

  async  findById(id:number){
    return this.prismaService.user.findUnique({
      where : {
        id
      }
    })
  }

  async getListOrders(id: number): Promise<Order[]> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { orders: true }
    });

    if (!user) {
      return [];
    }
    return user.orders;
  }
  async getAllStatusNumber(id:number){
    const grouped = await this.prismaService.order.groupBy({
      where: {
        userId: id
      },
      by: ['status'],
      _count: { status: true },
    });
    const orderStats = {
      all: 0,
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
        orderStats.all += group._count.status;
      }
    });
    return orderStats;
  }



}
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {

  constructor(private readonly prismaService: PrismaService) {
  }

  findBy(id: number): Promise<Order | null> {
    return this.prismaService.order.findUnique({
      where: {
        id:id
      }
    })
  }


}
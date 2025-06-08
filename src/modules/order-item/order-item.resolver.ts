import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { OrderItem } from '@/gql/model/order-item.model';

import { PrismaService } from '@/shared/prisma';


@Resolver(() => OrderItem)
export class OrderItemResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField(() => Int)
  async unitPrice(@Parent() orderItem: OrderItem) {
    if (orderItem.product) {
      return orderItem.product.current_retail_price;
    }

    const product = await this.prisma.product.findUnique({
      where: { product_id: orderItem.productId }
    });

    return product?.current_retail_price || 0;
  }

  @ResolveField(() => Int)
  async totalPrice(@Parent() orderItem: OrderItem) {
    const unitPrice = orderItem.product?.current_retail_price ||
      (await this.prisma.product.findUnique({
        where: { product_id: orderItem.productId }
      }))?.current_retail_price || 0;

    return unitPrice * orderItem.quantity;
  }
}
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { OrderItem } from '@/gql/model/order-item.model';
import { OrderItemService } from '@/modules/order-item/order-item.service';
import { Product } from '@/gql/model';


@Resolver(() => OrderItem)
export class OrderItemResolver{
  constructor(private orderItemService: OrderItemService) {
  }

  @Query(() => OrderItem)
  orderItem(@Args("id") id: number) : Promise<OrderItem> {
    return this.orderItemService.getOrderItem(id)
  }

  @ResolveField(() => Product)
  product(@Parent() orderItem: OrderItem) : Product | undefined {
      return orderItem.product;
  }



}
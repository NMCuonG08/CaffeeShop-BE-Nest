import { Order } from '@/gql/model/order.model';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from '@/modules/order/order.service';


@Resolver(() => Order)
export class OrderResolver {

  constructor(private readonly orderService: OrderService) {
  }

  @Query(() => Order, { nullable: true })
  async order(@Args("orderId") orderId : number  ): Promise<Order | null> {
      return this.orderService.findBy(orderId);
  }

}
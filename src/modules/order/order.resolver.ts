import { Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from '@/gql/model/order.model';
import { CreateOrderInput } from '@/modules/order/dto/create-input.order.dto';


@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Mutation(() => Order)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.orderService.create(createOrderInput);
  }

  @Query(() => [Order], { name: 'orders' })
  async findAll(
    @Args('userId', { type: () => Int, nullable: true }) userId?: number,
    @Args('status', { nullable: true }) status?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ) {
    return this.orderService.findAll({ userId, status, limit, offset });
  }

  @Query(() => Order, { name: 'order' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.orderService.findOne(id);
  }

  @Mutation(() => Order)
  async updateOrderStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status') status: string,
  ) {
    return this.orderService.updateStatus(id, status);
  }

  @Mutation(() => Order)
  async cancelOrder(@Args('id', { type: () => Int }) id: number) {
    return this.orderService.cancel(id);
  }
}

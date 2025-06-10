import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from '@/gql/model/order.model';
import { CreateOrderInput } from '@/modules/order/dto/create-input.order.dto';
import { OrderStatus } from '@/shared/types/order.type';
import {  GetUserFromGQL } from '@/modules/auth/decorator';
import { UseGuards } from '@nestjs/common';
import { GraphQLJSONObject } from 'graphql-type-json';
import { GqlAuthGuard } from '@/modules/auth/guard/gql-auth.guard';
import { User } from '@/gql/model';
import { OrderItem } from '@/gql/model/order-item.model';
import { UserInfo } from '@/gql/model/user-info.model';
import { PrismaService } from '@/shared/prisma';


@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly prismaService: PrismaService,
  ) {}

  @Mutation(() => Order)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.orderService.create(createOrderInput);
  }

  @Query(() => [Order], { name: 'orders' })
  @UseGuards(GqlAuthGuard)
  async findAll(
    @GetUserFromGQL("id") userId: number,
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
    @Args('status') status: OrderStatus,
  ) {
    return this.orderService.updateStatus(id, status);
  }

  @Mutation(() => Order)
  async cancelOrder(@Args('id', { type: () => Int }) id: number) {
    return this.orderService.cancel(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => GraphQLJSONObject, { name: 'orderStats' })
  async orderStats(
    @GetUserFromGQL("id") id: number
  ){
    return this.orderService.getAllStatusNumber(id);
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() order: Order) {
    return order.user;

  }



  @ResolveField(() => UserInfo, { nullable: true })
  async userInfo(@Parent() order: Order) {
    return this.prismaService.userInfo.findFirst({
      where: { userId: order.userId },
    });
  }



  // Resolve nested order items
  @ResolveField(() => [OrderItem])
  async items(@Parent() order: Order) {
    return order.items;

  }

}

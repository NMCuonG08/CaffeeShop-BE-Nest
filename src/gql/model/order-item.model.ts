import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Order } from '@/gql/model/order.model';
import { Product } from '@/gql/model/product.model';

@ObjectType()
export class OrderItem {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  quantity: number;

  // Relations
  @Field(() => Int)
  orderId: number;

  @Field(() => Order)
  order?: Order;

  @Field(() => Int)
  productId: number;

  @Field(() => Product)
  product?: Product;
}
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from '@/gql/model/product.model';

@ObjectType()
export class OrderItem {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  orderId: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  unitPrice: number;

  @Field(() => Int)
  totalPrice: number;

  @Field({ nullable: true })
  product?: Product;
}
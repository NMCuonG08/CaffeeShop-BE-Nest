import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
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

  @Field(() => Float)
  unitPrice: number;

  @Field(() => Int)
  totalPrice: number;

  @Field({ nullable: true })
  product?: Product;
}
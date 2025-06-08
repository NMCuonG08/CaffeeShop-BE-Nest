import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OrderItem } from '@/gql/model/order-item.model';
import { User } from '@/gql/model/user.model';
import { UserInfo } from '@/gql/model/user-info.model';

@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;

  @Field()
  createdAt: Date;

  @Field(() => Int)
  totalAmount: number;

  @Field()
  status: string;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int)
  userInfoId: number;

  @Field()
  paymentType: string;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => UserInfo,{ nullable: true })
  userInfo?: UserInfo;
}
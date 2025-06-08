import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '@/gql/model/user.model';
import { UserInfo } from '@/gql/model/user-info.model';
import { OrderItem } from '@/gql/model/order-item.model';


@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;


  @Field(() => Int)
  totalAmount: number | null;

  @Field(() => String)
  status: string;

  // Relations
  @Field(() => Int, { nullable: true })
  userId?: number | null;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Int)
  userInfoId?: number;

  @Field(() => UserInfo)
  userInfo?: UserInfo;

  @Field(() => [OrderItem])
  items?: OrderItem[];
}
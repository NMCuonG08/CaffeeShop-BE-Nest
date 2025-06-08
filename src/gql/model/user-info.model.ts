import { ObjectType, Field, Int, InputType, ArgsType } from '@nestjs/graphql';
import { User } from '@/gql/model/user.model';
import { Order } from '@/gql/model/order.model';

@ObjectType()
export class UserInfo {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  fullName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  district: string;

  @Field(() => String)
  ward: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  notes?: string | null;

  // Relations
  @Field(() => Int, { nullable: true })
  userId?: number | null;

  @Field(() => User)
  user?: User;

  @Field(() => [Order])
  orders?: Order[];
}
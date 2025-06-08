import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { FeedbackType, FeedbackStatus} from '@prisma/client';
import {Product} from './product.model';
import {User} from './user.model';

// Register enums cho GraphQL
registerEnumType(FeedbackType, {
  name: 'FeedbackType',
  description: 'Loại feedback',
});

registerEnumType(FeedbackStatus, {
  name: 'FeedbackStatus',
  description: 'Trạng thái feedback',
});

@ObjectType()
export class Feedback {
  @Field(() => Int)
  id: number;

  @Field()
  content: string;

  @Field(() => Int, { description: 'Rating từ 1-5 sao' })
  rating: number;

  @Field(() => FeedbackType)
  type: FeedbackType;

  @Field(() => FeedbackStatus)
  status: FeedbackStatus;

  @Field()
  userId: number;

  @Field()
  productId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Virtual fields (relations)
  @Field(() => User)
  user?: User;

  @Field(() => Product)
  product?: Product;
}
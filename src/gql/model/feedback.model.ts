import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { FeedbackType, FeedbackStatus, User, Product } from '@prisma/client';

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
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => Int, { description: 'Rating từ 1-5 sao' })
  rating: number;

  @Field(() => FeedbackType)
  type: FeedbackType;

  @Field(() => FeedbackStatus)
  status: FeedbackStatus;

  @Field()
  userId: string;

  @Field()
  productId: string;

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
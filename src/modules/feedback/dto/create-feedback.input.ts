import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsInt, Min, Max, IsEnum, IsNumber } from 'class-validator';
import { FeedbackType } from '@prisma/client';

@InputType()
export class CreateFeedbackInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field(() => Int)
  @IsInt()
  @Min(1, { message: 'Rating tối thiểu là 1' })
  @Max(5, { message: 'Rating tối đa là 5' })
  rating: number;

  @Field(() => FeedbackType, { defaultValue: FeedbackType.REVIEW })
  @IsEnum(FeedbackType)
  type: FeedbackType = FeedbackType.REVIEW;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
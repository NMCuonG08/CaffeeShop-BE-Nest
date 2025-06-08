import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { FeedbackType, FeedbackStatus } from '@prisma/client';

@InputType()
export class UpdateFeedbackInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @Field(() => FeedbackType, { nullable: true })
  @IsOptional()
  @IsEnum(FeedbackType)
  type?: FeedbackType;

  @Field(() => FeedbackStatus, { nullable: true })
  @IsOptional()
  @IsEnum(FeedbackStatus)
  status?: FeedbackStatus;
}
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsEmail, IsInt } from 'class-validator';

@InputType()
export class UpdateUserInfoInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  fullName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  district?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  ward?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string | null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  userId?: number;
}

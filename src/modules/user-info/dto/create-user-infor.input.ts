import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserInfoInput {
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

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => Int, { nullable: true })
  userId?: number | null;
}

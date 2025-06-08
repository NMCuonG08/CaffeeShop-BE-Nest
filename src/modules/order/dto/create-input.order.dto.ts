import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsArray, IsOptional, IsEnum } from 'class-validator';
import { PaymentType } from '@prisma/client';

registerEnumType(PaymentType, {
  name: 'PaymentType',
});



@InputType()
export class OrderItemInput {
  @Field(() => Int)
  @IsNotEmpty()
  productId: number;

  @Field(() => Int)
  @IsNotEmpty()
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  userId?: number;

  @Field(() => Int)
  @IsNotEmpty()
  userInfoId: number;

  @Field(() => PaymentType, { defaultValue: PaymentType.COD })
  @IsEnum(PaymentType)
  paymentType: PaymentType;


  @Field(() => [OrderItemInput])
  @IsArray()
  @IsNotEmpty()
  items: OrderItemInput[];
}
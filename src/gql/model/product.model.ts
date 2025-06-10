import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => Int)
  product_id: number;

  @Field(() => String, { nullable: true })
  product_group?: string;

  @Field(() => String, { nullable: true })
  product_category?: string;

  @Field(() => String, { nullable: true })
  product_type?: string;

  @Field(() => String, { nullable: true })
  product?: string;

  @Field(() => String, { nullable: true })
  product_description?: string;

  @Field(() => String, { nullable: true })
  unit_of_measure?: string;

  @Field(() => Float, { nullable: true })
  current_wholesale_price?: number;

  @Field(() => Float, { nullable: true })
  current_retail_price?: number;

  @Field(() => Boolean, { nullable: true })
  tax_exempt_yn?: boolean;

  @Field(() => Boolean, { nullable: true })
  promo_yn?: boolean;

  @Field(() => Boolean, { nullable: true })
  new_product_yn?: boolean;

  @Field(() => String, { nullable: true })
  product_image_cover?: string;
}

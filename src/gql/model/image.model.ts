import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProductImage } from '@/gql/model/product-image.model';
import {Product} from './product.model';

@ObjectType()
export class Image {
  @Field(() => Int)
  id: number;

  @Field()
  url: string;

  @Field()
  publicId: string;

  @Field()
  createdAt: Date;

  // Relations (optional)
  @Field(() => [ProductImage], { nullable: true })
  ProductImage?: ProductImage[];

  @Field(() => [Product], { nullable: true })
  Product?: Product[];
}
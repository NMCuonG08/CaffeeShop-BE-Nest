import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from './product.model';
import {Image} from './image.model';

@ObjectType()
export class ProductImage {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  imageId: number;

  // Relations
  @Field(() => Product)
  product: Product;

  @Field(() => Image)
  image: Image;
}
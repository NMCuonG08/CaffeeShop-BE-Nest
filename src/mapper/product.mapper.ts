import { Product } from '@prisma/client';
import { ProductResponseDto } from '../shared/dtos/responses/product-response.dto';

export function mapProductToResponse(
  product: Product,
  imageUrl?: string
): ProductResponseDto {
  return {
    product_id: product.product_id,
    product_group: product.product_group ?? undefined,
    product_category: product.product_category ?? undefined,
    product_type: product.product_type ?? undefined,
    product: product.product ?? undefined,
    product_description: product.product_description ?? undefined,
    unit_of_measure: product.unit_of_measure ?? undefined,
    current_wholesale_price: product.current_wholesale_price ?? undefined,
    current_retail_price: product.current_retail_price ?? undefined,
    tax_exempt_yn: product.tax_exempt_yn ?? undefined,
    promo_yn: product.promo_yn ?? undefined,
    new_product_yn: product.new_product_yn ?? undefined,
    product_image_cover: imageUrl ?? undefined,
  };
}

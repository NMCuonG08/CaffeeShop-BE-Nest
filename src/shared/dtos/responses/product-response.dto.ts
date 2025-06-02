import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductResponseDto {

  @IsNumber()
  product_id: number;

  @IsString()
  @IsOptional()
  product_group?: string;

  @IsString()
  @IsOptional()
  product_category?: string;

  @IsString()
  @IsOptional()
  product_type?: string;

  @IsString()
  @IsOptional()
  product?: string;

  @IsString()
  @IsOptional()
  product_description?: string;

  @IsString()
  @IsOptional()
  unit_of_measure?: string;

  @IsNumber()
  @IsOptional()
  current_wholesale_price?: number;

  @IsNumber()
  @IsOptional()
  current_retail_price?: number;

  @IsBoolean()
  @IsOptional()
  tax_exempt_yn?: boolean;

  @IsBoolean()
  @IsOptional()
  promo_yn?: boolean;

  @IsBoolean()
  @IsOptional()
  new_product_yn?: boolean;

  @IsString()
  @IsOptional()
  product_image_cover?: string;
}
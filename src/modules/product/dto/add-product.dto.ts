import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class AddNewProductDto {
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

    @Type(()=> Number)
    @IsNumber()
    @IsOptional()
    current_wholesale_price?: number;

    @Type(()=> Number)
    @IsNumber()
    @IsOptional()
    current_retail_price?: number;

    @Type(()=> Boolean)
    @IsBoolean()
    @IsOptional()
    tax_exempt_yn?: boolean;

    @Type(()=> Boolean)
    @IsBoolean()
    @IsOptional()
    promo_yn?: boolean;

    @Type(()=> Boolean)
    @IsBoolean()
    @IsOptional()
    new_product_yn?: boolean;
}



export class ProductResponseDto {
    product_id: number;
    product_group?: string | null;
    product_category?: string | null;
    product_type?: string | null;
    product?: string | null;
    product_description?: string | null;
    unit_of_measure?: string | null;
    current_wholesale_price?: number | null;
    current_retail_price?: number | null;
    tax_exempt_yn?: boolean | null;
    promo_yn?: boolean | null;
    new_product_yn?: boolean | null;
}
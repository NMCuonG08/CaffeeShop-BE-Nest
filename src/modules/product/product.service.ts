import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AddNewProductDto, ProductResponseDto } from './dto';
import { mapProductToResponse ,mapProductToResponseArray} from '@/mapper/product.mapper';
import { ImageService } from '@/modules/image/image.service';
import { ProductRepository } from '@/modules/product/product.repository';
import { ProductSortBy } from '@/shared/enums';



@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageService: ImageService
  ) {}

  async getProductById(id: number): Promise<ProductResponseDto | null> {
    const product = await this.productRepository.findById(id);
    if (!product) return null;

    const imageUrl = product.imageId
      ? await this.imageService.getImageUrl(product.imageId)
      : product.product_image_cover?.url;

    return mapProductToResponse(product, imageUrl||undefined);
  }

  async getAllProducts({ page, limit,sortBy,category,priceRange ,search}: {
    page: number;
    limit: number;
    sortBy: ProductSortBy;
    category?: string;
    priceRange?: string;
    search?: string;
  }): Promise<{ products: ProductResponseDto[]; total: number }> {
    const orderBy = this.mapSortEnumToPrisma(sortBy);
    let priceFilter = {};

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        priceFilter = {
          current_retail_price: {
            gte: min,
            lte: max,
          },
        };
      }
    }
    const [products, total] = await Promise.all([
      this.productRepository.findManyWithPagination(page, limit, orderBy,category,priceFilter,search),
      this.productRepository.countInStock(category,priceFilter,search)
    ]);

    const result = mapProductToResponseArray(products);

    return { products: result, total };
  }

  async addNewProduct(product: AddNewProductDto, file?: Express.Multer.File): Promise<any> {
    let imageId: number | undefined;

    // Upload image if provided
    if (file) {
      const uploadResult = await this.imageService.uploadImage(file);
      imageId = uploadResult?.id;
    }

    // Prepare data for creation
    const data: any = { ...product };
    if (imageId) {
      data.product_image_cover = {
        connect: { id: imageId }
      };
    }

    try {
      return await this.productRepository.create(data);
    } catch (error) {
      // Cleanup uploaded image if product creation fails
      if (imageId) {
        await this.imageService.deleteImage(imageId);
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async updateProduct(
    id: number,
    product: AddNewProductDto,
    file?: Express.Multer.File
  ): Promise<ProductResponseDto> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const oldImageId = existingProduct.imageId;
    let newImageId: number | undefined;

    // Upload new image if provided
    if (file) {
      const uploadResult = await this.imageService.uploadImage(file);
      newImageId = uploadResult?.id;
    }

    // Update product in transaction
    try {
      await this.productRepository.executeTransaction(async (tx) => {
        const updateData: any = { ...product };

        if (newImageId) {
          updateData.product_image_cover = {
            connect: { id: newImageId }
          };
        }

        await tx.product.update({
          where: { product_id: id },
          data: updateData,
        });
      });
    } catch (error) {
      // Rollback: delete new image if transaction fails
      if (newImageId) {
        await this.imageService.deleteImage(newImageId);
      }
      throw new InternalServerErrorException('Failed to update product');
    }

    // Clean up old image after successful update
    if (newImageId && oldImageId) {
      await this.imageService.deleteImage(oldImageId);
    }

    // Return updated product
    const updatedProduct = await this.productRepository.findById(id);
    const imageUrl = updatedProduct?.imageId
      ? await this.imageService.getImageUrl(updatedProduct.imageId)
      : updatedProduct?.product_image_cover?.url;

    return mapProductToResponse(updatedProduct!, imageUrl||undefined);
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await this.productRepository.executeTransaction(async (tx) => {
        const product = await tx.product.findUnique({
          where: { product_id: id }
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Delete product first
        await tx.product.delete({
          where: { product_id: id }
        });

        // Clean up image after successful deletion
        if (product.imageId) {
          await this.imageService.deleteImage(product.imageId);
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete product');
    }
  }

  async getCheapestProducts(limit: number = 5): Promise<ProductResponseDto[]> {
    try {
      const products = await this.productRepository.findCheapest(limit);
      return mapProductToResponseArray(products);
    } catch (error) {
      console.error('Error in getCheapestProducts:', error);
      throw new InternalServerErrorException('Failed to get cheapest products');
    }
  }

  private  mapSortEnumToPrisma(sortBy: ProductSortBy): { [key: string]: 'asc' | 'desc' } {
    switch (sortBy) {
      case ProductSortBy.PRICE_ASC:
        return { current_retail_price: 'asc' };
      case ProductSortBy.PRICE_DESC:
        return { current_retail_price: 'desc' };
      case ProductSortBy.NAME_ASC:
        return { product: 'asc' };
      case ProductSortBy.NAME_DESC:
        return { product: 'desc' };
      case ProductSortBy.CREATED_AT:
        return { created_at: 'desc' };
      case ProductSortBy.PRODUCT_ID:
      default:
        return { product_id: 'desc' };
    }
  }



}



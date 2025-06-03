import {
    Body,
    Controller,
    DefaultValuePipe, Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query, UploadedFile,
    UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ProductService } from "./product.service";
import { AddNewProductDto, ProductResponseDto } from "./dto";
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { JWTGuard } from '../auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RedisService } from '@/shared/redis/redis.service';

@Controller("product")
export class ProductController {
    constructor(private productService : ProductService, private readonly redisService : RedisService) {}


    @Get("/list")
        async getAllProducts(
            @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
            @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
            ) {

            limit = limit > 100 ? 100 : limit;

            return this.productService.getAllProducts({ page, limit });
        }

    @UseGuards(JWTGuard, RolesGuard)
    @Roles('ADMIN')
    @Post("/add")
    @UseInterceptors(FileInterceptor('image'))
    async addNewProduct(
        @Body() product : AddNewProductDto,
        @UploadedFile() file?: Express.Multer.File
    ){

        const newProduct = await this.productService.addNewProduct(product,file);
        if (!newProduct) {
            throw new NotFoundException("Product not found");
        }
        return newProduct;
    }
    @UseGuards(JWTGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch("update/:id")
    @UseInterceptors(FileInterceptor('image'))
    async updateProduct(
        @Param("id", ParseIntPipe) id : number,
        @Body() product : AddNewProductDto,
        @UploadedFile() file?: Express.Multer.File
    ) : Promise<ProductResponseDto> {
        const updatedProduct = await this.productService.updateProduct(id, product,file);
        if (!updatedProduct) {
            throw new NotFoundException("Product not found");
        }
        return updatedProduct;
    }

    @UseGuards(JWTGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete('/delete/:id')
    async deleteProduct(
      @Param("id", ParseIntPipe) id : number,
    ){
        return this.productService.deleteProduct(id);
    }

    @Get("/cheapest")
    async getCheapestProducts(
      @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    ) {
        limit = limit > 20 ? 20 : limit; // Max 20 items
        const cacheKey = `cheapest_products_${limit}`;
        try {
            const cachedProducts = await this.redisService.get<ProductResponseDto[]>(cacheKey);
            if (cachedProducts) {
                console.log('🎯 Cache HIT - Returning from Redis');
                return {
                    products: cachedProducts,
                    source: 'cache',
                    timestamp: new Date().toISOString(),
                    count: cachedProducts.length
                };
            }
            console.log('💾 Cache MISS - Querying database');
            const products = await this.productService.getCheapestProducts(limit);

            // 3. Lưu vào Redis với TTL 5 phút (300 seconds)
            await this.redisService.set(cacheKey, products, 300);

            return {
                products: products,
                source: 'database',
                timestamp: new Date().toISOString(),
                count: products.length
            };

        } catch (error) {
            console.error('❌ Error in getCheapestProducts:', error);
            // Fallback to database if Redis fails
            const products = await this.productService.getCheapestProducts(limit);
            return {
                products: products,
                source: 'database_fallback',
                timestamp: new Date().toISOString(),
                count: products.length,
                error: 'Cache unavailable'
            };
        }
    }
    @Get(":id")
    async getProductById(
      @Param("id", ParseIntPipe) id : number
    ) : Promise<ProductResponseDto> {

        const product = await this.productService.getProductById(id);
        if (!product) {
            throw new NotFoundException("Product not found");
        }
        return product;
    }




}
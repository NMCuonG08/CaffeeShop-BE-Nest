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

@Controller("product")
export class ProductController {
    constructor(private productService : ProductService) {}


    @Get("/list")
        async getAllProducts(
            @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
            @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
            ) {

            limit = limit > 100 ? 100 : limit;

            return this.productService.getAllProducts({ page, limit });
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




}
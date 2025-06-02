import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TransformResponseInterceptor } from "src/interceptors/transform-response.interceptor";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { PrismaModule } from "src/shared/prisma/prisma.module";
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';

@Module({
    imports: [
        PrismaModule,
        CloudinaryModule
    ],
    controllers: [ProductController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformResponseInterceptor
        },
        ProductService
    ],
    exports: [ProductService],
    

})
export class ProductModule {}
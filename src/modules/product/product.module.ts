import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TransformResponseInterceptor } from "@/interceptors/transform-response.interceptor";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { PrismaModule } from "@/shared/prisma/prisma.module";
import { CloudinaryModule } from '@/shared/cloudinary/cloudinary.module';
import { RedisModule } from '@/shared/redis/redis.module';
import { ImageModule } from '@/modules/image/image.module';
import { ProductRepository } from '@/modules/product/product.repository';
import { ProductResolver } from '@/modules/product/product.resolver';
import { FeedbackModule } from '@/modules/feedback/feedback.module';

@Module({
    imports: [
        PrismaModule,
        CloudinaryModule,
        RedisModule,
        ImageModule,
      FeedbackModule,

    ],
    controllers: [ProductController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformResponseInterceptor
        },
        ProductService,
        ProductRepository,
        ProductResolver
    ],
    exports: [ProductService],
    

})
export class ProductModule {}
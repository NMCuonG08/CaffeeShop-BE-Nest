import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { RedisModule } from './shared/redis/redis.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { ImageModule } from '@/modules/image/image.module';
import { FeedbackModule } from '@/modules/feedback/feedback.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { VNPayModule } from '@/payment/vnpay/vnpay.module';
import { UserInfoModule } from '@/modules/user-info/user-info.module';
import { OrderModule } from '@/modules/order/order.module';
import { OrderItemModule } from '@/modules/order-item/order-item.module';
import { DataLoaderFactory } from '@/shared/dataloader/dataloader.factory';
import { DataLoaderModule } from '@/shared/dataloader/dataloader.module'; // ← Import module

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
      ignoreEnvFile: true,
    }),
    DataLoaderModule,
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [DataLoaderModule],
      inject: [DataLoaderFactory],
      useFactory: (dataLoaderFactory: DataLoaderFactory) => ({
        playground: false,
        autoSchemaFile: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': true,
        },
        context: ({ req, connection }) => {
          const loaders = dataLoaderFactory.createAllLoaders();

          if (connection) {
            return { req: connection.context, ...loaders };
          }
          return { req, ...loaders };
        },
      }),
    }),
    AuthModule,
    UserModule,
    ProductModule,
    PrismaModule,
    RedisModule,
    ImageModule,
    FeedbackModule,
    VNPayModule,
    UserInfoModule,
    OrderModule,
    OrderItemModule
  ],
  controllers: [],
})
export class AppModule {}
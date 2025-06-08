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
import { FeedbackService } from '@/modules/feedback/feedback.service';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { createLoader } from "@/shared/dataloader/feedback.dataloader";
import { VNPayModule } from '@/payment/vnpay/vnpay.module';
import { UserInfoModule } from '@/modules/user-info/user-info.module';
import { OrderModule } from '@/modules/order/order.module';
import { OrderItemModule } from '@/modules/order-item/order-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [FeedbackModule],
      inject: [FeedbackService],
      useFactory: (feedbackService: FeedbackService) => ({
        playground: false,
        autoSchemaFile: true,

        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': true,
        },
        context: ({ req, connection }) => {
          const loader = createLoader(feedbackService);

          if (connection) {
            return { req: connection.context, feedbackLoader: loader };
          }
          return { req, feedbackLoader: loader };
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
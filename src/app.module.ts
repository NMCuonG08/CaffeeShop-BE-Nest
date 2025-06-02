// import { Config } from './../node_modules/prisma/prisma-client/runtime/index-browser.d';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
      AuthModule,
      UserModule,
      ProductModule,
      PrismaModule],
  controllers: [],
})
export class AppModule {}

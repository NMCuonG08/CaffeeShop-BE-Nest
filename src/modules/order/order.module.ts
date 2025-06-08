import { Module } from '@nestjs/common';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { OrderService } from '@/modules/order/order.service';
import { OrderResolver } from '@/modules/order/order.resolver';

@Module({
  imports: [PrismaModule],
  providers: [OrderService,OrderResolver]
})

export class OrderModule {}
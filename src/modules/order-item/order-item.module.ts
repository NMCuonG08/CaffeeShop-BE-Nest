import { Module } from '@nestjs/common';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { OrderItemService } from '@/modules/order-item/order-item.service';
import { OrderItemResolver } from '@/modules/order-item/order-item.resolver';

@Module({
  imports: [PrismaModule],
  providers: [OrderItemService, OrderItemResolver]
})

export class OrderItemModule {}
import { Module } from '@nestjs/common';
import { DataLoaderFactory } from './dataloader.factory';
import { FeedbackModule } from '@/modules/feedback/feedback.module';
import { PrismaModule } from '@/shared/prisma/prisma.module';

@Module({
  imports: [FeedbackModule, PrismaModule],
  providers: [DataLoaderFactory],
  exports: [DataLoaderFactory],
})
export class DataLoaderModule {}
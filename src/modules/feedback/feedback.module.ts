import { Module } from '@nestjs/common';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { FeedbackService } from '@/modules/feedback/feedback.service';
import { FeedbackResolver } from '@/modules/feedback/feedback.resolver';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule
  ],
  providers:[FeedbackService,
            FeedbackResolver
  ],
  controllers:[],
  exports: [FeedbackService],
})

export class FeedbackModule {}
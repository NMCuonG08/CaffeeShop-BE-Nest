import { Module } from '@nestjs/common';
import { UserInfoService } from '@/modules/user-info/user-info.service';
import { UserInfoResolver } from '@/modules/user-info/user-info.resolver';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [PrismaModule,UserModule],
  providers: [UserInfoService, UserInfoResolver],
})

export class UserInfoModule {}

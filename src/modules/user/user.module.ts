import { Module } from "@nestjs/common";
import { UserController } from './user.controller';
import { UserService } from '@/modules/user/user.service';
import { PrismaModule } from '@/shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

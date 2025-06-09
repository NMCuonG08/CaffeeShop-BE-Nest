import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { PrismaService } from '@/shared/prisma';


@Injectable()
export class UserInfoLoader {
  constructor(private prisma: PrismaService) {}

  createLoader() {
    return new DataLoader(async (userIds: number[]) => {
      const users = await this.prisma.user.findMany({
        where: { id: { in: userIds } },
        include: { userInfos: true }
      });

      return userIds.map(id => users.find(user => user.id === id));
    });
  }
}
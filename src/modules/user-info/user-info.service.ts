import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma';
import { UserInfo } from '@prisma/client';
import { CreateUserInfoInput } from '@/modules/user-info/dto/create-user-infor.input';

@Injectable()
export class UserInfoService {
  constructor(private readonly prismaService: PrismaService) {

  }

  async findById(id : number) : Promise<UserInfo | null>{
    return this.prismaService.userInfo.findUnique({
      where: { id },
    })
  }

  async create(userInfo: CreateUserInfoInput): Promise<UserInfo> {
    if (userInfo.userId) {
      const existing = await this.prismaService.userInfo.findFirst({
        where: { userId: userInfo.userId },
      });
      if (existing) {
        return this.update(existing.id, userInfo);
      }
    }
    return this.prismaService.userInfo.create({
      data: userInfo,
    });
  }

  async update(id: number, userInfo: CreateUserInfoInput): Promise<UserInfo> {
    const existing = await this.prismaService.userInfo.findUnique({
      where: { id },
    });

    if (!existing && userInfo.userId) {
      const byUser = await this.prismaService.userInfo.findFirst({
        where: { userId: userInfo.userId },
      });
      if (byUser) {
        // Nếu tìm được, update theo bản ghi đó
        return this.prismaService.userInfo.update({
          where: { id: byUser.id },
          data: userInfo,
        });
      }
      // Không có bản ghi => tạo mới
      return this.prismaService.userInfo.create({
        data: userInfo,
      });
    }

    // Nếu đã tồn tại, cập nhật bình thường
    return this.prismaService.userInfo.update({
      where: { id },
      data: userInfo,
    });
  }



}
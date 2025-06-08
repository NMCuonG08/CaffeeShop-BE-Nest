import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma';
import { UserInfo } from '@prisma/client';
import { CreateUserInfoInput } from '@/modules/user-info/dto/create-user-infor.input';
import { UpdateUserInfoInput } from '@/modules/user-info/dto/update-user-infor.input';

@Injectable()
export class UserInfoService {
  constructor(private readonly prismaService: PrismaService) {

  }

  async findById(id : number) : Promise<UserInfo | null>{
    return this.prismaService.userInfo.findFirst({
      where: {
        userId: id
      }
    })
  }

  async create(userInfo: CreateUserInfoInput): Promise<UserInfo> {
    // Kiểm tra xem đã tồn tại userInfo với userId này chưa
    if (userInfo.userId) {
      const existing = await this.prismaService.userInfo.findFirst({
        where: { userId: userInfo.userId },
      });

      if (existing) {
        // Cập nhật thông tin existing record
        return this.prismaService.userInfo.update({
          where: { id: existing.id },
          data: userInfo,
        });
      }
    }

    // Tạo mới nếu chưa tồn tại
    return this.prismaService.userInfo.create({
      data: userInfo,
    });
  }

  async update(userId: number, userInfo: UpdateUserInfoInput): Promise<UserInfo> {
    // Lọc bỏ undefined values
    const cleanData = Object.fromEntries(
      Object.entries(userInfo).filter(([_, value]) => value !== undefined)
    ) as any;

    // Tìm record theo userId
    const existing = await this.prismaService.userInfo.findFirst({
      where: { userId },
    });

    if (existing) {
      // Nếu tìm thấy, update record đó
      return this.prismaService.userInfo.update({
        where: { id: existing.id },
        data: cleanData,
      });
    }

    // Nếu không tìm thấy record nào, tạo mới
    return this.prismaService.userInfo.create({
      data: {
        ...cleanData,
        userId, // Đảm bảo userId được set
      },
    });
  }


}
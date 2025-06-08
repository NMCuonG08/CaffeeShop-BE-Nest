import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma';


@Injectable()
export class UserService{
  constructor(private readonly prismaService: PrismaService) {
  }

  async  findById(id:number){
    return this.prismaService.user.findUnique({
      where : {
        id
      }
    })
  }


}
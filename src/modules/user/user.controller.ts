import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Order, User } from '@prisma/client';
import { GetUser } from 'src/modules/auth/decorator';
import { UserService } from '@/modules/user/user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getUser(@GetUser() user : User,
        @GetUser('id') id : number ){
        console.log({id});
        return user
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/orders') async getListOrders(
      @GetUser('id') id: number
    ): Promise<Order[]> {
        const res = await this.userService.getAllStatusNumber(id);
        console.log(res);
        return this.userService.getListOrders(id);
    }

}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/modules/auth/decorator';

@Controller('user')
export class UserController {

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getUser(@GetUser() user : User,
        @GetUser('id') id : number ){
        console.log({id});
        return user
    }

}

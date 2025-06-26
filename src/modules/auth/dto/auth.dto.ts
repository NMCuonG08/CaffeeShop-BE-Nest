import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {

    @ApiProperty({
        example: 'Joind',
        description: 'user name',
    })
    @IsString()
    @Optional()
    name?: string;

    @ApiProperty({
        example: 'user@example.com',
        description: 'Địa chỉ email hợp lệ để đăng nhập',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'strongPassword123',
        description: 'Mật khẩu người dùng',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Địa chỉ email hợp lệ để đăng nhập',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'strongPassword123',
        description: 'Mật khẩu người dùng',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}

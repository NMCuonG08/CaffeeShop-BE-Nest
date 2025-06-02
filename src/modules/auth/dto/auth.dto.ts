import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Optional } from '@nestjs/common';

export class AuthDto {
    @IsString()
    @Optional()
    name?: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

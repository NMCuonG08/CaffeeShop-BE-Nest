import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/shared/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { GoogleStrategy } from './strategy/google.strategy';


@Module({
  imports: [JwtModule.register(
    { secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: "8h" } }),
     PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,GoogleStrategy],
})
export class AuthModule {}

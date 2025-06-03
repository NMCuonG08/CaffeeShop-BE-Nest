import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from "src/shared/prisma/prisma.service";
import * as argon from 'argon2'
import { AuthDto, LoginDto } from './dto';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { OAuth2Client } from 'google-auth-library';

interface GoogleTokenPayload {
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  sub: string; // Google user ID
}
@Injectable({})
export class AuthService{
  private readonly logger = new Logger(AuthService.name);

  private googleClient: OAuth2Client;
    constructor(private prisma : PrismaService, private jwt : JwtService,private config: ConfigService){
      this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

   async login(dto : LoginDto){
    try {
        const user =await this.prisma.user.findUnique({
            where : {
                email :dto.email
            }
        })

        if (!user) {
            throw new ForbiddenException('Credentials incorrect')
        }
        if (!user.hash) {
            throw new ForbiddenException('Credentials incorrect')
        }
        const checkPassword = await argon.verify(user.hash, dto.password)
        if (!checkPassword) {
            throw new ForbiddenException('Credentials incorrect')
        }
        // delete user.hash   
        const token = await this.signToken(user.id, user.email)
       
        return {
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                picture:user.picture
            },
            token: token
        }
    }
    catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken')
            }
        }
        throw error
    }
   
   }
   
    async signup(dto :AuthDto ){
       try {
         const hash = await argon.hash(dto.password)

        const user = await this.prisma.user.create({
            data : {
                firstName: dto.name,
                email: dto.email,
                hash : hash,
            }
        })
        const token =  await this.signToken(user.id, user.email)
        return {
            success: true,
            message: 'User created successfully',
            user: user,
            token: token
        }
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken')
            }
        }
        throw error
      }
    }


    async signToken(userId : number, email : string) : Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }
        const token = await this.jwt.signAsync(payload, {

            secret: this.config.get('JWT_SECRET')
        })
        return {
            access_token: token
        }
    }
  async googleLogin(credential: string) {
    try {
      // Verify Google JWT token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload() as GoogleTokenPayload;

      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      // Check if user already exists
      let user = await this.prisma.user.findUnique({
        where: {
          email: payload.email,
          provider: 'GOOGLE'
        },
      });

      // If user doesn't exist, create a new one
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: payload.email,
            firstName: payload.given_name || '',
            lastName: payload.family_name || '',
            picture: payload.picture || '',
            provider: "GOOGLE",
            providerId: payload.sub
          }
        });
      }

      // Generate your app's JWT token
      const token = await this.signToken(user.id, user.email);

      return {
        token: token.access_token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
        },
      };
    } catch (error) {
      this.logger.error('Google login failed:', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }
  async googleOAuthLogin(googleUser: any) {
    try {
      // googleUser từ Guard đã chứa thông tin user
      const { email, firstName, lastName, picture, id } = googleUser;

      // Check if user already exists
      let user = await this.prisma.user.findUnique({
        where: {
          email: email,
          provider: 'GOOGLE'
        },
      });

      // If user doesn't exist, create a new one
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: email,
            firstName: firstName || '',
            lastName: lastName || '',
            picture: picture || '',
            provider: "GOOGLE",
            providerId: id
          }
        });
      } else {
        // Update user info if needed
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            picture: picture || user.picture,
          }
        });
      }

      // Generate your app's JWT token
      const token = await this.signToken(user.id, user.email);

      return {
        token: token.access_token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
          role: user.role
        },
      };
    } catch (error) {
      this.logger.error('Google OAuth login failed:', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async validateUser(email: string, sub: string) {
    const user = await this.prisma.user.findUnique({
      where: { email, id: parseInt(sub) },
    });

    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

}
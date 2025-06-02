import { ConfigService } from '@nestjs/config';

import { Injectable } from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config : ConfigService,
    private prisma : PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'defaultsecret',
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
  }) {
    
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
  //  delete user.hash;

    return user;
  }
}
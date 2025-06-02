import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptions } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing Google OAuth config');
    }

    const options: StrategyOptions = {
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    };

    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // console.log('=== DEBUG Google Profile ===');
    // console.log('Profile:', JSON.stringify(profile, null, 2));

    if (!profile) {
      return done(new Error('Google profile not found'), false);
    }

    const { name, emails, photos, id } = profile;

    // Kiểm tra dữ liệu cần thiết
    if (!emails || emails.length === 0) {
      console.error('No email found in Google profile');
      return done(new Error('Email not provided by Google'), false);
    }

    const user = {
      id: id, // Thêm id từ profile
      email: emails[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0]?.value,
      accessToken,
    };

    console.log('Processed user:', user);
    done(null, user);
  }
}
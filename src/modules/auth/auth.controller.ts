import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { JWTGuard } from './guard/jwt.guard'
import { AuthDto, LoginDto } from './dto/auth.dto';
import { GoogleOAuthGuard } from './guard/google.guard';
import { Request} from 'express';


@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  signup(@Body() dto: AuthDto) {
     console.log({dto});
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {

    return this.authService.login(dto);
  }


  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleLogin() {

  }
  
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {

    const token = await this.authService.googleOAuthLogin(req.user);
    const accessToken = token.token;

    // Redirect về frontend với token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${encodeURIComponent(accessToken)}`);

  }

  @UseGuards(JWTGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
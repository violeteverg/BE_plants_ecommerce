import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { AuthService } from 'src/services/auth.service';
import { LocalGuard } from 'src/local.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { access_token, refresh_token } =
      await this.authService.register(createUserDto);

    res.setHeader('Set-Cookie', [access_token, refresh_token.cookie]);
    res.send({
      message: 'successfully register',
    });
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req, @Res() res: Response) {
    // const accessTokenCookie = this.authService.getCookiesWithJwtToken(
    //   req.user.userId,
    // );
    // const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
    //   req.user.userId,
    // );
    // console.log(refreshTokenCookie);

    // await this.userService.setCurrentRefreshToken(
    //   refreshTokenCookie.token,
    //   req.user.userId,
    // );

    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );
    console.log('access:', access_token);
    console.log('refresh:', refresh_token);

    res.setHeader('Set-Cookie', [access_token, refresh_token.cookie]);
    res.send({
      message: 'successfully login',
      isLogin: true,
    });
  }
}

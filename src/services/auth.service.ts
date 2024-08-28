import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/user/create-user.dto';
// import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'src/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    // private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...restData } = user;
      return restData;
    }
    return null;
  }

  async generateTokenToCookie(user: any) {
    const payload = { email: user.email, sub: user.id };

    const refreshTokenCookie = this.getCookieWithJwtRefreshToken(payload.sub);
    const accessTokenCookie = this.getCookiesWithJwtToken(payload.sub);

    await this.userService.setCurrentRefreshToken(
      refreshTokenCookie?.token,
      payload?.sub,
    );

    return {
      refresh_token: refreshTokenCookie,
      access_token: accessTokenCookie,
    };
  }

  async register(data: CreateUserDto) {
    const user = await this.userService.create(data);
    return this.generateTokenToCookie(user);
  }

  async login(data: any) {
    return this.generateTokenToCookie(data);
  }

  public getCookiesWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_TOKEN,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
    return `Authentication=${token}; HttpOnly; SameSite=None; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`;
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
    const cookie = `Refresh=${token}; HttpOnly; SameSite=None; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;
    return {
      cookie,
      token,
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(
    payload: object
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessTokenPayload = {
      ...payload,
    };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async refreshToken(
    oldRefreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload: any = await this.verifyToken(oldRefreshToken);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete payload.exp;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const accessTokenPayload = {
      ...payload,
      extraProp: 'updatedValue',
    };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn: '15m',
    });
    const newRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}

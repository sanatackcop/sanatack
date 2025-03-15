import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>
  ) {}

  async generateTokens(
    payload: object,
    user_id: string
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

    const tokenEntity = this.tokenRepository.create({
      user: { id: user_id },
      lastLoginAt: new Date(),
      refreshToken: refreshToken,
    });

    await this.tokenRepository.save(tokenEntity);

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async refreshToken(
    oldRefreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { refreshToken: oldRefreshToken },
    });
    if (!tokenEntity) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const payload = await this.verifyToken(oldRefreshToken);
    delete payload.exp;

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

    tokenEntity.refreshToken = newRefreshToken;
    await this.tokenRepository.save(tokenEntity);

    return { accessToken, refreshToken: newRefreshToken };
  }
}

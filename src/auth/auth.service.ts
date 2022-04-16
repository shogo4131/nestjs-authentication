import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Token } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  /**
   * パスワードハッシュ関数
   * @param data
   */
  private hashData(data: string) {
    return bcrypt.hash(data, 12);
  }

  async getToken(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.ACCESS_TOKEN_KEY,
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.REFRESH_TOKEN_KEY,
          expiresIn: 60 * 60 * 24,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signup(dto: AuthDto): Promise<Token> {
    const { email, password } = dto;
    const hash = await this.hashData(password);

    const createUser = await this.prisma.user.create({
      data: { email, hash },
    });

    const tokens = await this.getToken(createUser.id, createUser.email);

    return tokens;
  }

  //   signin() {}

  //   logout() {}

  //   refreshToken() {}
}

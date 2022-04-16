import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      /* headerからtokenを適切に取得する設定 */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_KEY,
      passRequestToCallback: true,
    });
  }

  validation(req: Request, payload: any) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}

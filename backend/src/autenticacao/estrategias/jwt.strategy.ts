import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

interface ConteudoJwt {
  sub: number;
  email: string;
  perfil: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(conteudo: ConteudoJwt) {
    return {
      usuarioId: conteudo.sub,
      email: conteudo.email,
      perfil: conteudo.perfil,
    };
  }
}
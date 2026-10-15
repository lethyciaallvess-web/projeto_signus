import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entidades/usuario.entity';
import { AutenticacaoController } from './autenticacao.controller';
import { AutenticacaoService } from './autenticacao.service';
import { JwtStrategy } from './estrategias/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d' as const,
        },
      }),
    }),
  ],
  controllers: [AutenticacaoController],
  providers: [
    AutenticacaoService,
    JwtStrategy,
  ],
})
export class AutenticacaoModule {}
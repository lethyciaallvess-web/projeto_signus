import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entidades/usuario.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AutenticacaoService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,

    private readonly jwtService: JwtService,
  ) {}

  async login(dados: LoginDto) {
    const usuario = await this.usuariosRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.senhaHash')
      .where('usuario.email = :email', {
        email: dados.email,
      })
      .getOne();

    if (!usuario) {
      throw new UnauthorizedException(
        'E-mail ou senha inválidos.',
      );
    }

    const senhaValida = await bcrypt.compare(
      dados.senha,
      usuario.senhaHash,
    );

    if (!senhaValida) {
      throw new UnauthorizedException(
        'E-mail ou senha inválidos.',
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    });

    return {
      accessToken,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  }
}
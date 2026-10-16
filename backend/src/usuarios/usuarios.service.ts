import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import {
  PerfilUsuario,
  Usuario,
} from './entidades/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) { }

  async criar(dados: CriarUsuarioDto) {
    if (dados.senha !== dados.confirmacaoSenha) {
      throw new BadRequestException(
        'A confirmação de senha deve ser igual à senha.',
      );
    }

    const usuarioExistente = await this.usuariosRepository.findOne({
      where: [
        { email: dados.email },
        { cpf: dados.cpf },
      ],
    });

    if (usuarioExistente) {
      const campo =
        usuarioExistente.email === dados.email
          ? 'e-mail'
          : 'CPF';

      throw new ConflictException(
        `Já existe um usuário com esse ${campo}.`,
      );
    }

    const senhaHash = await bcrypt.hash(dados.senha, 12);

    const usuario = this.usuariosRepository.create({
      nome: dados.nome,
      email: dados.email,
      cpf: dados.cpf,
      senhaHash,
      perfil: PerfilUsuario.OPERADOR,
    });

    const usuarioSalvo =
      await this.usuariosRepository.save(usuario);

    return {
      id: usuarioSalvo.id,
      nome: usuarioSalvo.nome,
      email: usuarioSalvo.email,
      cpf: usuarioSalvo.cpf,
      perfil: usuarioSalvo.perfil,
      criadoEm: usuarioSalvo.criadoEm,
    };
  }
  async atualizarProprio(
    usuarioId: number,
    dados: AtualizarUsuarioDto,
  ) {
    if (dados.senha !== dados.confirmacaoSenha) {
      throw new BadRequestException(
        'A confirmação de senha deve ser igual à senha.',
      );
    }

    const usuario = await this.usuariosRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(
        'Usuário não encontrado.',
      );
    }
    const usuarioComCpf = await this.usuariosRepository.findOne({
      where: { cpf: dados.cpf },
    });

    if (
      usuarioComCpf &&
      usuarioComCpf.id !== usuario.id
    ) {
      throw new ConflictException(
        'Já existe outro usuário com esse CPF.',
      );
}
    usuario.nome = dados.nome;
    usuario.cpf = dados.cpf;
    usuario.senhaHash = await bcrypt.hash(
      dados.senha,
      12,
    );

    const usuarioAtualizado =
      await this.usuariosRepository.save(usuario);

    return {
      id: usuarioAtualizado.id,
      nome: usuarioAtualizado.nome,
      email: usuarioAtualizado.email,
      cpf: usuarioAtualizado.cpf,
      perfil: usuarioAtualizado.perfil,
      atualizadoEm: usuarioAtualizado.atualizadoEm,
    };
  }

}

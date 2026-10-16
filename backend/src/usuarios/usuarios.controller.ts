import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  @Post()
  criar(@Body() dados: CriarUsuarioDto) {
    return this.usuariosService.criar(dados);
  }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  atualizarProprio(
    @Req()
    requisicao: Request & {
      user: { usuarioId: number };
    },
    @Body() dados: AtualizarUsuarioDto,
  ) {
    return this.usuariosService.atualizarProprio(
      requisicao.user.usuarioId,
      dados,
    );
  }
}
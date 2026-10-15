import { Body, Controller, Post } from '@nestjs/common';
import { AutenticacaoService } from './autenticacao.service';
import { LoginDto } from './dto/login.dto';

@Controller('autenticacao')
export class AutenticacaoController {
  constructor(
    private readonly autenticacaoService: AutenticacaoService,
  ) {}

  @Post('login')
  login(@Body() dados: LoginDto) {
    return this.autenticacaoService.login(dados);
  }
}
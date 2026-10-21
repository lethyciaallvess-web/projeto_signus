import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsTaxId,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CriarUsuarioDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'O nome deve ser um texto.' })
  @MinLength(3, {
    message: 'O nome deve ter pelo menos 3 caracteres.',
  })
  @MaxLength(150, {
    message: 'O nome deve ter no máximo 150 caracteres.',
  })
  nome!: string;

  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim().toLowerCase()
      : value,
  )
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, {
    message: 'Informe um e-mail válido.',
  })
  @MaxLength(255)
  email!: string;

  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.replace(/\D/g, '')
      : value,
  )
  @IsString()
  @Length(11, 11, {
    message: 'O CPF deve possuir 11 números.',
  })
  @IsTaxId('pt-BR', {
    message: 'Informe um CPF válido.',
  })
  cpf!: string;

  @IsString()
  @MinLength(8, {
    message: 'A senha deve ter pelo menos 8 caracteres.',
  })
  @MaxLength(72)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
    {
      message:
        'A senha deve possuir letra maiúscula, minúscula, número e caractere especial.',
    },
  )
  senha!: string;

  @IsString()
  confirmacaoSenha!: string;
}
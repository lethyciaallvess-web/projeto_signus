import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
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

  @IsString({ message: 'A senha deve ser um texto.' })
  @MinLength(8, {
    message: 'A senha deve possuir pelo menos 8 caracteres.',
  })
  @MaxLength(72)
  senha!: string;
}
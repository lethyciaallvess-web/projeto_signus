import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PerfilUsuario {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR',
}

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id!: number;

  @Column({
    type: 'varchar',
    length: 150,
  })
  nome!: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'char',
    length: 11,
    unique: true,
  })
  cpf!: string;

  @Column({
    name: 'senha_hash',
    type: 'varchar',
    length: 255,
    select: false,
  })
  senhaHash!: string;

  @Column({
    type: 'enum',
    enum: PerfilUsuario,
    default: PerfilUsuario.OPERADOR,
  })
  perfil!: PerfilUsuario;

  @CreateDateColumn({
    name: 'criado_em',
    type: 'timestamp',
  })
  criadoEm!: Date;

  @UpdateDateColumn({
    name: 'atualizado_em',
    type: 'timestamp',
  })
  atualizadoEm!: Date;
}
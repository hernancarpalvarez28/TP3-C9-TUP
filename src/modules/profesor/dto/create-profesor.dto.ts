import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import type { Modalidad, Nivel } from '../../../generated/prisma/enums.js';

export class CreateProfesorDto {
  // id del usuario dueño de este perfil (tiene que tener rol profesor)
  @IsInt({ message: 'El userId tiene que ser un número entero' })
  @IsPositive({ message: 'El userId tiene que ser mayor a 0' })
  userId: number;

  @IsString({ message: 'La materia tiene que ser un texto' })
  @IsNotEmpty({ message: 'La materia es obligatoria' })
  materia: string;

  @IsIn(['primario', 'secundario', 'universitario', 'adultos'], {
    message:
      'El nivel tiene que ser primario, secundario, universitario o adultos',
  })
  nivel: Nivel;

  @IsNumber({}, { message: 'El precio tiene que ser un número' })
  @IsPositive({ message: 'El precio tiene que ser mayor a 0' })
  precio: number;

  @IsArray({ message: 'Las modalidades tienen que enviarse como una lista' })
  @ArrayNotEmpty({ message: 'Tenés que elegir al menos una modalidad' })
  @IsIn(['Virtual', 'Presencial'], {
    each: true,
    message: 'Cada modalidad tiene que ser Virtual o Presencial',
  })
  modalidades: Modalidad[];

  @IsOptional()
  @IsString({ message: 'La formación tiene que ser un texto' })
  formacion?: string;

  @IsOptional()
  @IsInt({ message: 'Los años de experiencia tienen que ser un número entero' })
  @Min(0, { message: 'Los años de experiencia no pueden ser negativos' })
  experiencia?: number;

  @IsOptional()
  @IsString({ message: 'Los horarios tienen que ser un texto' })
  horarios?: string;

  @IsOptional()
  @IsString({ message: 'La zona tiene que ser un texto' })
  zona?: string;

  @IsOptional()
  @IsString({ message: 'La descripción tiene que ser un texto' })
  @MaxLength(500, {
    message: 'La descripción puede tener como máximo 500 caracteres',
  })
  descripcion?: string;
}

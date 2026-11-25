import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import type { Modalidad, Nivel } from '../../../generated/prisma/enums.js';

export class CreateAlumnoDto {
  // id del usuario dueño de este perfil (tiene que tener rol alumno)
  @IsInt({ message: 'El userId tiene que ser un número entero' })
  @IsPositive({ message: 'El userId tiene que ser mayor a 0' })
  userId: number;

  @IsIn(['primario', 'secundario', 'universitario', 'adultos'], {
    message:
      'El nivel tiene que ser primario, secundario, universitario o adultos',
  })
  nivel: Nivel;

  @IsIn(['Virtual', 'Presencial', 'Ambas'], {
    message: 'La modalidad tiene que ser Virtual, Presencial o Ambas',
  })
  modalidad: Modalidad;

  @IsOptional()
  @IsArray({ message: 'Las materias tienen que enviarse como una lista' })
  @IsString({ each: true, message: 'Cada materia tiene que ser un texto' })
  materias?: string[];

  @IsOptional()
  @IsString({ message: 'La descripción tiene que ser un texto' })
  @MaxLength(500, {
    message: 'La descripción puede tener como máximo 500 caracteres',
  })
  descripcion?: string;
}

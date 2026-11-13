import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAlumnoDto {
  @IsIn(['primario', 'secundario', 'universitario', 'adultos'], {
    message:
      'El nivel tiene que ser primario, secundario, universitario o adultos',
  })
  nivel: string;

  @IsIn(['Virtual', 'Presencial', 'Ambas'], {
    message: 'La modalidad tiene que ser Virtual, Presencial o Ambas',
  })
  modalidad: string;

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

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePrincipalDto {
  @IsString({ message: 'La materia tiene que ser un texto' })
  @IsNotEmpty({ message: 'Escribí qué materia querés aprender' })
  materia: string;

  @IsOptional()
  @IsString({ message: 'La zona tiene que ser un texto' })
  zona?: string;
}

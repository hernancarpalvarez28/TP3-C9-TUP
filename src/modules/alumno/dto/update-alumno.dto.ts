import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAlumnoDto } from './create-alumno.dto.js';

// Al editar, todos los campos son opcionales y no se puede cambiar el userId
// (así un perfil no puede pasar a otro usuario).
export class UpdateAlumnoDto extends PartialType(
  OmitType(CreateAlumnoDto, ['userId'] as const),
) {}

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProfesorDto } from './create-profesor.dto.js';

// Al editar, todos los campos son opcionales y no se puede cambiar el userId
// (así un perfil no puede pasar a otro usuario).
export class UpdateProfesorDto extends PartialType(
  OmitType(CreateProfesorDto, ['userId'] as const),
) {}

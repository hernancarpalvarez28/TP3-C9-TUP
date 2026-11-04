import { PartialType } from '@nestjs/mapped-types';
import { CreatePrincipalDto } from './create-principal.dto.js';

export class UpdatePrincipalDto extends PartialType(CreatePrincipalDto) {}

import { Module } from '@nestjs/common';
import { AlumnoService } from './alumno.service.js';
import { AlumnoController } from './alumno.controller.js';

@Module({
  controllers: [AlumnoController],
  providers: [AlumnoService],
})
export class AlumnoModule {}

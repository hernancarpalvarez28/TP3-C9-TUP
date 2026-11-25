import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AlumnoService } from './alumno.service.js';
import { CreateAlumnoDto } from './dto/create-alumno.dto.js';
import { UpdateAlumnoDto } from './dto/update-alumno.dto.js';

// Convierte el :id de la URL en número. Si no es un número, responde 400 con este mensaje.
const idPipe = new ParseIntPipe({
  exceptionFactory: () =>
    new BadRequestException('El id tiene que ser un número entero.'),
});

@Controller('alumno')
export class AlumnoController {
  constructor(private readonly alumnoService: AlumnoService) {}

  @Post()
  create(@Body() createAlumnoDto: CreateAlumnoDto) {
    return this.alumnoService.create(createAlumnoDto);
  }

  @Get()
  findAll() {
    return this.alumnoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', idPipe) id: number) {
    return this.alumnoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', idPipe) id: number,
    @Body() updateAlumnoDto: UpdateAlumnoDto,
  ) {
    return this.alumnoService.update(id, updateAlumnoDto);
  }

  @Delete(':id')
  remove(@Param('id', idPipe) id: number) {
    return this.alumnoService.remove(id);
  }
}

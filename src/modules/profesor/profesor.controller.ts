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
import { ProfesorService } from './profesor.service.js';
import { CreateProfesorDto } from './dto/create-profesor.dto.js';
import { UpdateProfesorDto } from './dto/update-profesor.dto.js';

// Convierte el :id de la URL en número. Si no es un número, responde 400 con este mensaje.
const idPipe = new ParseIntPipe({
  exceptionFactory: () =>
    new BadRequestException('El id tiene que ser un número entero.'),
});

@Controller('profesor')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  create(@Body() createProfesorDto: CreateProfesorDto) {
    return this.profesorService.create(createProfesorDto);
  }

  @Get()
  findAll() {
    return this.profesorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', idPipe) id: number) {
    return this.profesorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', idPipe) id: number,
    @Body() updateProfesorDto: UpdateProfesorDto,
  ) {
    return this.profesorService.update(id, updateProfesorDto);
  }

  @Delete(':id')
  remove(@Param('id', idPipe) id: number) {
    return this.profesorService.remove(id);
  }
}

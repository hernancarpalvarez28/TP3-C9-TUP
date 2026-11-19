import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { esErrorDeDatoRepetido } from '../prisma/prisma-error.util.js';
import { CreateAlumnoDto } from './dto/create-alumno.dto.js';
import { UpdateAlumnoDto } from './dto/update-alumno.dto.js';

// Junto con el perfil devolvemos los datos del usuario, pero sin el hash de la contraseña.
const conUsuario = { user: { omit: { passwordHash: true } } } as const;

@Injectable()
export class AlumnoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlumnoDto: CreateAlumnoDto) {
    await this.verificarUsuario(createAlumnoDto.userId);

    try {
      return await this.prisma.alumno.create({
        data: createAlumnoDto,
        include: conUsuario,
      });
    } catch (error) {
      if (esErrorDeDatoRepetido(error)) {
        throw new ConflictException(
          'Este usuario ya tiene un perfil de alumno.',
        );
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.alumno.findMany({
      include: conUsuario,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const perfil = await this.prisma.alumno.findUnique({
      where: { id },
      include: conUsuario,
    });

    if (!perfil) {
      throw new NotFoundException(
        `No existe un perfil de alumno con el id ${id}.`,
      );
    }

    return perfil;
  }

  async update(id: number, updateAlumnoDto: UpdateAlumnoDto) {
    await this.findOne(id);

    return this.prisma.alumno.update({
      where: { id },
      data: updateAlumnoDto,
      include: conUsuario,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.alumno.delete({ where: { id }, include: conUsuario });
  }

  // Antes de crear el perfil: el usuario tiene que existir, tener rol alumno
  // y no tener ya un perfil de alumno.
  private async verificarUsuario(userId: number) {
    const usuario = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { rol: true, alumno: { select: { id: true } } },
    });

    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con el id ${userId}.`);
    }

    if (usuario.rol !== 'alumno') {
      throw new BadRequestException(
        'Este usuario no tiene rol alumno, así que no puede tener perfil de alumno.',
      );
    }

    if (usuario.alumno) {
      throw new ConflictException('Este usuario ya tiene un perfil de alumno.');
    }
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { esErrorDeDatoRepetido } from '../prisma/prisma-error.util.js';
import { CreateProfesorDto } from './dto/create-profesor.dto.js';
import { UpdateProfesorDto } from './dto/update-profesor.dto.js';

// Junto con el perfil devolvemos los datos del usuario, pero sin el hash de la contraseña.
const conUsuario = { user: { omit: { passwordHash: true } } } as const;

@Injectable()
export class ProfesorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfesorDto: CreateProfesorDto) {
    await this.verificarUsuario(createProfesorDto.userId);

    try {
      return await this.prisma.profesor.create({
        data: createProfesorDto,
        include: conUsuario,
      });
    } catch (error) {
      if (esErrorDeDatoRepetido(error)) {
        throw new ConflictException(
          'Este usuario ya tiene un perfil de profesor.',
        );
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.profesor.findMany({
      include: conUsuario,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const perfil = await this.prisma.profesor.findUnique({
      where: { id },
      include: conUsuario,
    });

    if (!perfil) {
      throw new NotFoundException(
        `No existe un perfil de profesor con el id ${id}.`,
      );
    }

    return perfil;
  }

  async update(id: number, updateProfesorDto: UpdateProfesorDto) {
    await this.findOne(id);

    return this.prisma.profesor.update({
      where: { id },
      data: updateProfesorDto,
      include: conUsuario,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.profesor.delete({ where: { id }, include: conUsuario });
  }

  // Antes de crear el perfil: el usuario tiene que existir, tener rol profesor
  // y no tener ya un perfil de profesor.
  private async verificarUsuario(userId: number) {
    const usuario = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { rol: true, profesor: { select: { id: true } } },
    });

    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con el id ${userId}.`);
    }

    if (usuario.rol !== 'profesor') {
      throw new BadRequestException(
        'Este usuario no tiene rol profesor, así que no puede tener perfil de profesor.',
      );
    }

    if (usuario.profesor) {
      throw new ConflictException(
        'Este usuario ya tiene un perfil de profesor.',
      );
    }
  }
}

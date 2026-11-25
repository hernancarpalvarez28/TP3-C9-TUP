import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { esErrorDeDatoRepetido } from '../prisma/prisma-error.util.js';
import { hashPassword } from './password.util.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

// "omit" le dice a Prisma que no devuelva ese campo: el hash nunca sale en las respuestas.
const sinPassword = { passwordHash: true } as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.verificarDniYEmail(createUserDto.dni, createUserDto.email);

    // Separamos la contraseña para guardar solo su hash.
    const { password, ...datos } = createUserDto;

    try {
      return await this.prisma.user.create({
        data: { ...datos, passwordHash: await hashPassword(password) },
        omit: sinPassword,
      });
    } catch (error) {
      if (esErrorDeDatoRepetido(error)) {
        throw new ConflictException(
          'Ya existe un usuario con ese DNI o email.',
        );
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      omit: sinPassword,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.user.findUnique({
      where: { id },
      omit: sinPassword,
      include: { alumno: true, profesor: true },
    });

    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con el id ${id}.`);
    }

    return usuario;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const usuario = await this.findOne(id);
    await this.verificarDniYEmail(updateUserDto.dni, updateUserDto.email, id);

    // Si ya tiene perfil, cambiarle el rol dejaría un alumno con perfil de profesor (o al revés).
    const cambiaElRol = updateUserDto.rol && updateUserDto.rol !== usuario.rol;
    if (cambiaElRol && (usuario.alumno || usuario.profesor)) {
      throw new BadRequestException(
        'No se puede cambiar el rol de un usuario que ya tiene perfil. Primero borrá su perfil.',
      );
    }

    const { password, ...datos } = updateUserDto;

    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...datos,
          // Si mandan una contraseña nueva, también se guarda hasheada.
          ...(password ? { passwordHash: await hashPassword(password) } : {}),
        },
        omit: sinPassword,
      });
    } catch (error) {
      if (esErrorDeDatoRepetido(error)) {
        throw new ConflictException(
          'Ya existe un usuario con ese DNI o email.',
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    // Por el onDelete: Cascade del esquema, también se borra su perfil.
    return this.prisma.user.delete({ where: { id }, omit: sinPassword });
  }

  // Revisa antes de guardar que el DNI y el email no los tenga otro usuario.
  private async verificarDniYEmail(
    dni?: string,
    email?: string,
    idActual?: number,
  ) {
    if (dni) {
      const conEseDni = await this.prisma.user.findUnique({
        where: { dni },
        select: { id: true },
      });
      if (conEseDni && conEseDni.id !== idActual) {
        throw new ConflictException('Ya existe un usuario con ese DNI.');
      }
    }

    if (email) {
      const conEseEmail = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (conEseEmail && conEseEmail.id !== idActual) {
        throw new ConflictException('Ya existe un usuario con ese email.');
      }
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BuscarPrincipalDto } from './dto/buscar-principal.dto.js';

@Injectable()
export class PrincipalService {
  constructor(private readonly prisma: PrismaService) {}

  // Busca los profesores que dan esa materia (y en esa zona, si la mandan).
  buscar(buscarPrincipalDto: BuscarPrincipalDto) {
    const { materia, zona } = buscarPrincipalDto;

    return this.prisma.profesor.findMany({
      where: {
        // contains + insensitive: "mate" encuentra "Matemática"
        materia: { contains: materia, mode: 'insensitive' },
        zona: zona ? { contains: zona, mode: 'insensitive' } : undefined,
      },
      // Cada profesor trae su usuario, sin la contraseña
      include: { user: { omit: { passwordHash: true } } },
      // Del más barato al más caro
      orderBy: { precio: 'asc' },
    });
  }
}

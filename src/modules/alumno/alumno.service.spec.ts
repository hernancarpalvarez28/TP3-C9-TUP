import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { AlumnoService } from './alumno.service.js';

// PrismaService falso (mock), así el test no usa la base de datos real.
const crearPrismaMock = () => ({
  user: { findUnique: vi.fn() },
  alumno: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
});

const nuevoPerfil = {
  userId: 1,
  nivel: 'secundario' as const,
  modalidad: 'Virtual' as const,
  materias: ['Matemática'],
};

describe('AlumnoService', () => {
  let service: AlumnoService;
  let prisma: ReturnType<typeof crearPrismaMock>;

  beforeEach(async () => {
    prisma = crearPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AlumnoService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<AlumnoService>(AlumnoService);
  });

  it('está definido', () => {
    expect(service).toBeDefined();
  });

  it('crea el perfil si el usuario existe, es alumno y no tiene perfil', async () => {
    prisma.user.findUnique.mockResolvedValue({ rol: 'alumno', alumno: null });
    prisma.alumno.create.mockResolvedValue({ id: 1 });

    await expect(service.create(nuevoPerfil)).resolves.toEqual({ id: 1 });
  });

  it('da 404 si el usuario no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.create(nuevoPerfil)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('da 400 si el usuario tiene otro rol', async () => {
    prisma.user.findUnique.mockResolvedValue({ rol: 'profesor', alumno: null });

    await expect(service.create(nuevoPerfil)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('da 409 si el usuario ya tiene perfil de alumno', async () => {
    prisma.user.findUnique.mockResolvedValue({
      rol: 'alumno',
      alumno: { id: 3 },
    });

    await expect(service.create(nuevoPerfil)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(prisma.alumno.create).not.toHaveBeenCalled();
  });

  it('da 404 si el perfil no existe', async () => {
    prisma.alumno.findUnique.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProfesorService } from './profesor.service.js';

// PrismaService falso (mock), así el test no usa la base de datos real.
const crearPrismaMock = () => ({
  user: { findUnique: vi.fn() },
  profesor: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
});

const nuevoPerfil = {
  userId: 1,
  materia: 'Matemática',
  nivel: 'secundario' as const,
  precio: 5000,
  modalidades: ['Virtual' as const],
};

describe('ProfesorService', () => {
  let service: ProfesorService;
  let prisma: ReturnType<typeof crearPrismaMock>;

  beforeEach(async () => {
    prisma = crearPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfesorService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
  });

  it('está definido', () => {
    expect(service).toBeDefined();
  });

  it('crea el perfil si el usuario existe, es profesor y no tiene perfil', async () => {
    prisma.user.findUnique.mockResolvedValue({
      rol: 'profesor',
      profesor: null,
    });
    prisma.profesor.create.mockResolvedValue({ id: 1 });

    await expect(service.create(nuevoPerfil)).resolves.toEqual({ id: 1 });
  });

  it('da 404 si el usuario no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.create(nuevoPerfil)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('da 400 si el usuario tiene otro rol', async () => {
    prisma.user.findUnique.mockResolvedValue({ rol: 'alumno', profesor: null });

    await expect(service.create(nuevoPerfil)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('da 409 si el usuario ya tiene perfil de profesor', async () => {
    prisma.user.findUnique.mockResolvedValue({
      rol: 'profesor',
      profesor: { id: 3 },
    });

    await expect(service.create(nuevoPerfil)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(prisma.profesor.create).not.toHaveBeenCalled();
  });

  it('da 404 si el perfil no existe', async () => {
    prisma.profesor.findUnique.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});

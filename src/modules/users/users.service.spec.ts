import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from './users.service.js';

// En los tests reemplazamos PrismaService por un objeto falso (mock),
// así no se usa la base de datos real.
const crearPrismaMock = () => ({
  user: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
});

const nuevoUsuario = {
  nombre: 'Ana Pérez',
  dni: '12345678',
  email: 'ana@mail.com',
  telefono: '3815555555',
  ciudad: 'San Miguel de Tucumán',
  password: 'secreta123',
  rol: 'alumno' as const,
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: ReturnType<typeof crearPrismaMock>;

  beforeEach(async () => {
    prisma = crearPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('está definido', () => {
    expect(service).toBeDefined();
  });

  it('guarda la contraseña hasheada y no la devuelve', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 1 });

    await service.create(nuevoUsuario);

    const { data, omit } = prisma.user.create.mock.calls[0][0];
    expect(data.password).toBeUndefined();
    expect(data.passwordHash).not.toBe('secreta123');
    expect(await bcrypt.compare('secreta123', data.passwordHash)).toBe(true);
    expect(omit).toEqual({ passwordHash: true });
  });

  it('da 409 si el DNI ya está registrado', async () => {
    prisma.user.findUnique.mockResolvedValueOnce({ id: 5 });

    await expect(service.create(nuevoUsuario)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('da 404 si el usuario no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});

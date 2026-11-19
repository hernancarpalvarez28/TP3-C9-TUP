import { Test, TestingModule } from '@nestjs/testing';
import { AlumnoController } from './alumno.controller.js';
import { AlumnoService } from './alumno.service.js';

describe('AlumnoController', () => {
  let controller: AlumnoController;
  // Service falso: acá solo probamos que el controller le pase los datos.
  const serviceMock = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlumnoController],
      providers: [{ provide: AlumnoService, useValue: serviceMock }],
    }).compile();

    controller = module.get<AlumnoController>(AlumnoController);
  });

  it('está definido', () => {
    expect(controller).toBeDefined();
  });

  it('busca por id usando el service', async () => {
    serviceMock.findOne.mockResolvedValue({ id: 7 });

    await expect(controller.findOne(7)).resolves.toEqual({ id: 7 });
    expect(serviceMock.findOne).toHaveBeenCalledWith(7);
  });
});

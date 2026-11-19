import { Test, TestingModule } from '@nestjs/testing';
import { ProfesorController } from './profesor.controller.js';
import { ProfesorService } from './profesor.service.js';

describe('ProfesorController', () => {
  let controller: ProfesorController;
  // Service falso: acá solo probamos que el controller le pase los datos.
  const serviceMock = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfesorController],
      providers: [{ provide: ProfesorService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ProfesorController>(ProfesorController);
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

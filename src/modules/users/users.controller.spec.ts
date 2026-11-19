import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;
  // Service falso: acá solo probamos que el controller le pase los datos.
  const serviceMock = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: serviceMock }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
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

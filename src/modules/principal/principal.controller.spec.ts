import { Test, TestingModule } from '@nestjs/testing';
import { PrincipalController } from './principal.controller.js';
import { PrincipalService } from './principal.service.js';

describe('PrincipalController', () => {
  let controller: PrincipalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrincipalController],
      providers: [PrincipalService],
    }).compile();

    controller = module.get<PrincipalController>(PrincipalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

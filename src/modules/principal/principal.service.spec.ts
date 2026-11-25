import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrincipalService } from './principal.service.js';

describe('PrincipalService', () => {
  let service: PrincipalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrincipalService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<PrincipalService>(PrincipalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

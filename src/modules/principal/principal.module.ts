import { Module } from '@nestjs/common';
import { PrincipalService } from './principal.service.js';
import { PrincipalController } from './principal.controller.js';

@Module({
  controllers: [PrincipalController],
  providers: [PrincipalService],
})
export class PrincipalModule {}

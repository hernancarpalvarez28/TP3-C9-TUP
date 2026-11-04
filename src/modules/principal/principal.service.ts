import { Injectable } from '@nestjs/common';
import { CreatePrincipalDto } from './dto/create-principal.dto.js';
import { UpdatePrincipalDto } from './dto/update-principal.dto.js';

@Injectable()
export class PrincipalService {
  create(createPrincipalDto: CreatePrincipalDto) {
    return 'This action adds a new principal';
  }

  findAll() {
    return `This action returns all principal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} principal`;
  }

  update(id: number, updatePrincipalDto: UpdatePrincipalDto) {
    return `This action updates a #${id} principal`;
  }

  remove(id: number) {
    return `This action removes a #${id} principal`;
  }
}

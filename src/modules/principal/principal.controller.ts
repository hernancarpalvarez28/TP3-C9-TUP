import { Controller, Get, Query } from '@nestjs/common';
import { PrincipalService } from './principal.service.js';
import { BuscarPrincipalDto } from './dto/buscar-principal.dto.js';

// El buscador de la página de inicio: solo busca, por eso tiene una sola ruta GET.
@Controller('principal')
export class PrincipalController {
  constructor(private readonly principalService: PrincipalService) {}

  // Ejemplo: GET /principal?materia=Matemática&zona=Yerba Buena
  @Get()
  buscar(@Query() buscarPrincipalDto: BuscarPrincipalDto) {
    return this.principalService.buscar(buscarPrincipalDto);
  }
}

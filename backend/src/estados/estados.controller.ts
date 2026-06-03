import { Controller, Get, UseGuards} from '@nestjs/common';
import { EstadosService } from './estados.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('estados')
@UseGuards(JwtAuthGuard)
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) { }

  @Get()
  findAll() {
    return this.estadosService.findAll();
  }
  
}
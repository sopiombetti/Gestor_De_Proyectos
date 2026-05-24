import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { CreateEstadoDto } from './dto/create-estado.dto';

@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) { }

  @Post()
  create(@Body() createEstadoDto: CreateEstadoDto) {
    return this.estadosService.create(createEstadoDto);
  }
  @Get()
  findAll() {
    return this.estadosService.findAll();
  }
}
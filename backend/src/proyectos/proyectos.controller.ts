import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { FindProyectoQueryDto } from './dto/find-proyecto.dto';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) { }

  @Post()
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectosService.create(createProyectoDto);
  }

  @Get()
  findAll(@Query() filters: FindProyectoQueryDto) {
    return this.proyectosService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProyectoDto: UpdateProyectoDto) {
    return this.proyectosService.update(+id, updateProyectoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('force') force?: string) {
    return this.proyectosService.remove(+id, force === 'true');
  }
}

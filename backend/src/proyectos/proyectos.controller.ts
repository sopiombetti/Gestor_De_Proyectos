import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { FindProyectoQueryDto } from './dto/find-proyecto.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Proyectos')
@ApiBearerAuth()
@Controller('proyectos')
@UseGuards(JwtAuthGuard)
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) { }

  @Post()
  @ApiOperation({ summary: 'Crea un proyecto (el líder es el admin autenticado)' })
  @UseGuards(AdminGuard)
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectosService.create(createProyectoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista proyectos, con filtros opcionales por usuario/proyecto' })
  findAll(@Query() filters: FindProyectoQueryDto) {
    return this.proyectosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un proyecto por id' })
  findOne(@Param('id') id: string) {
    return this.proyectosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un proyecto' })
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updateProyectoDto: UpdateProyectoDto) {
    return this.proyectosService.update(+id, updateProyectoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un proyecto (force=true para forzar con tareas asociadas)' })
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string, @Query('force') force?: string) {
    return this.proyectosService.remove(+id, force === 'true');
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { FindTareasQueryDto } from './dto/find-tareas-query.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { CreateTareasBulkFileDTO } from './dto/create-tareas-bulkFile.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tareas')
@ApiBearerAuth()    
@Controller('tareas')
@UseGuards(JwtAuthGuard)
export class TareasController {
  constructor(private readonly tareasService: TareasService) { }

  @Post()
  @ApiOperation({ summary: 'Crea una tarea individual' })
  @UseGuards(AdminGuard)
  create(@Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.create(createTareaDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Carga masiva de tareas desde un archivo, validadas fila por fila' })
  @UseGuards(AdminGuard)
  createBulk(@Body() createTareasBulkFileDTO: CreateTareasBulkFileDTO) {
    return this.tareasService.createBulk(createTareasBulkFileDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Lista tareas, con filtros opcionales por usuario/prioridad' })
  findAll(@Query() filters: FindTareasQueryDto) {
    return this.tareasService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una tarea por id' }) 
  findOne(@Param('id') id: string) {
    return this.tareasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una tarea (estado, usuario, estimación, tiempo final)' }) 
  update(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaDto) {
    return this.tareasService.update(+id, updateTareaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una tarea' })
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.tareasService.remove(+id);
  }
}
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { FindTareasQueryDto } from './dto/find-tareas-query.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { CreateTareasBulkFileDTO } from './dto/create-tareas-bulkFile.dto';

@Controller('tareas')
@UseGuards(JwtAuthGuard)
export class TareasController {
  constructor(private readonly tareasService: TareasService) { }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.create(createTareaDto);
  }

  @Post('bulk')
  @UseGuards(AdminGuard)
  createBulk(@Body() createTareasBulkFileDTO: CreateTareasBulkFileDTO) { 
    return this.tareasService.createBulk(createTareasBulkFileDTO);
  }

  @Get()
  findAll(@Query() filters: FindTareasQueryDto) {
    return this.tareasService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tareasService.findOne(+id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaDto) {
    return this.tareasService.update(+id, updateTareaDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.tareasService.remove(+id);
  }
}
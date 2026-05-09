import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) { }

  @Post()
  create(@Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.create(createTareaDto);
  }

  @Get()
  findAll() {
    return this.tareasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tareasService.findOne(+id);
  }
  
  @Get('/usuario/:id')
  findByUsuario(@Param('id') id: string) {
    return this.tareasService.findByUsuario(+id);
  }

  @Get('/prioridad/:id')
  findByPrioridad(@Param('id') id: string) {
    return this.tareasService.findByPrioridad(+id);
  }

  @Get('/estado/:id')
  findByEstado(@Param('id') id: string) {
    return this.tareasService.findByEstado(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaDto) {
    return this.tareasService.update(+id, updateTareaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tareasService.remove(+id);
  }
}

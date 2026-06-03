import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login-usuario.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.usuariosService.login(body);
  }
}

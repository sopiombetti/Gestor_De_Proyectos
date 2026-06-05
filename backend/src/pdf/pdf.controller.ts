
import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import express from 'express';
import { PdfService } from './pdf.service';
import { ProyectosService } from '../proyectos/proyectos.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('reportes')
//@UseGuards(AdminGuard)
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly projectsService: ProyectosService,
  ) {}

  @Get('proyectos/:id')
  async getProjectReport(@Param('id') id: string, @Res() res: express.Response) {
    const project = await this.projectsService.getReportData(+id);
    const buffer  = await this.pdfService.generateProjectReport(project);

    res.set({
      'Content-Type':'application/pdf',
      'Content-Disposition': `attachment; filename="informe.pdf"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
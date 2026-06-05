import { Module } from "@nestjs/common";
import { PdfController } from "./pdf.controller";
import { PdfService } from "./pdf.service";
import { ProyectosModule } from "src/proyectos/proyectos.module";

@Module({
  controllers: [PdfController],
  providers: [PdfService],
  imports: [ProyectosModule]
})
export class ReportesModule {}
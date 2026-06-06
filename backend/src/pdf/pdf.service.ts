
import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
//import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ProjectReport, TaskReport, TaskStatus } from '../types/report.types';

@Injectable()
export class PdfService {
  private printer: any;

  private colors = {
    primary: '#2563EB', 
    sin_asignar: '#6B7280', 
    asignada: '#D97706', 
    en_proceso: '#2563EB', 
    finalizada: '#16A34A', 
    headerBg: '#1E3A5F',
    rowAlt: '#F1F5F9',
    white: '#FFFFFF',
    text: '#1E293B',
    muted: '#64748B',
  };

  private statusLabel: Record<TaskStatus, string> = {
    sin_asignar: 'SIN ASIGNAR',
    asignada: 'ASIGNADA',
    en_proceso: 'EN PROCESO',
    finalizada: 'FINALIZADA',
  };

  constructor() {
    const fonts = {
      Roboto: {
        normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
        bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
        italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
        bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf',
      },
    };
    this.printer = new PdfPrinter(fonts);
  }

  generateProjectReport(project: ProjectReport): Promise<Buffer> {
    const docDefinition = this.buildDocDefinition(project);
    const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      pdfDoc.on('data', chunk => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });
  }

  // Documento principal
  private buildDocDefinition(project: ProjectReport): any {
    const tasksByStatus = this.groupByStatus(project.tasks);
    const summary = this.buildSummary(project.tasks);

    return {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],

      // Encabezado en todas las páginas
      header: (currentPage, pageCount) => ({
        columns: [
          { text: project.name, style: 'pageHeader', margin: [40, 15, 0, 0] },
          {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'right',
            style: 'pageHeaderMuted',
            margin: [0, 15, 40, 0],
          },
        ],
      }),

      // Pie de página
      footer: () => ({
        text: `Generado el ${this.formatDate(project.generatedAt)}`,
        alignment: 'center',
        style: 'footerText',
        margin: [0, 10, 0, 0],
      }),

      content: [
        this.buildCover(project),
        summary,
        ...this.buildStatusSections(tasksByStatus),
      ],

      styles: this.buildStyles(),
      defaultStyle: { font: 'Roboto', fontSize: 9, color: this.colors.text },
    };
  }

  // Portada
  private buildCover(project: ProjectReport) {
    return [
      {
        canvas: [{
          type: 'rect',
          x: 0, y: 0, w: 515, h: 120,
          color: this.colors.headerBg,
          r: 6,
        }],
      },
      {

        stack: [
          { text: 'INFORME DE PROYECTO', style: 'coverLabel' },
          { text: project.name,          style: 'coverTitle' },
          { text: project.description,   style: 'coverDesc'  },
        ],
        absolutePosition: { x: 55, y: 25 },
        margin: [0, 0, 0, 30],
      },
      { text: '', margin: [0, 100, 0, 0] },
    ];
  }

  // Resumen
  private buildSummary(tasks: TaskReport[]) {
    const total      = tasks.length;
    const byStatus   = this.groupByStatus(tasks);

    const statuses: TaskStatus[] = ['sin_asignar', 'asignada', 'en_proceso', 'finalizada'];

    const columns = statuses.map(status => ({
      stack: [
        {
          text: String(byStatus[status]?.length ?? 0),
          style: 'summaryNumber',
          color: this.colors[status],
        },
        { text: this.statusLabel[status], style: 'summaryLabel' },
      ],
      alignment: 'center',
    }));

    return [
      { text: 'Resumen del Proyecto', style: 'sectionTitle', margin: [0, 0, 0, 10] },
      {
        table: {
          widths: ['*', '*', '*', '*'],
          body: [[ ...columns ]],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#E2E8F0',
          vLineColor: () => '#E2E8F0',
          paddingTop:    () => 12,
          paddingBottom: () => 12,
        },
        margin: [0, 0, 0, 20],
      },
      { text: `Total de tareas: ${total}`, style: 'mutedText', margin: [0, 0, 0, 20] },
    ];
  }

  // Secciones por estado
  private buildStatusSections(tasksByStatus: Record<TaskStatus, TaskReport[]>) {
    const order: TaskStatus[] = ['sin_asignar', 'asignada', 'en_proceso', 'finalizada'];

    return order
      .filter(status => tasksByStatus[status]?.length > 0)
      .map(status => this.buildStatusSection(status, tasksByStatus[status]));
  }

  private buildStatusSection(status: TaskStatus, tasks: TaskReport[]) {
    const color = this.colors[status];
    const label = this.statusLabel[status];

    return [
      {
        canvas: [{ type: 'rect', x: 0, y: 0, w: 4, h: 18, color }],
      },
      {
        text: `${label}  (${tasks.length} tarea${tasks.length !== 1 ? 's' : ''})`,
        style:            'statusTitle',
        color,
        absolutePosition: { x: 55, y: -2 },
        margin:           [0, 0, 0, 0],
      },
      { text: '', margin: [0, 14, 0, 6] },

      // Tabla de tareas
      {
        table: {
          headerRows: 1,
          widths:     this.getColumnWidths(status),
          body: [
            this.getTableHeader(status),
            ...tasks.map((task, i) => this.buildTaskRow(task, status, i)),
          ],
        },
        layout: {
          hLineWidth: (i: number) => (i === 1 ? 0 : 0.5),
          vLineWidth: ()           => 0,
          hLineColor: ()           => '#E2E8F0',
          fillColor:  (i: number) =>
            i === 0
              ? color
              : i % 2 === 0
              ? this.colors.rowAlt
              : this.colors.white,
        },
        margin: [0, 0, 0, 24],
      },
    ];
  }

  // Columnas según estado
  private getColumnWidths(status: TaskStatus): string[] {
    switch (status) {
      case 'sin_asignar': return ['*', '60%'];
      case 'asignada':    return ['*', '25%', '20%', '20%'];
      case 'en_proceso':  return ['*', '25%', '20%', '15%'];
      case 'finalizada':  return ['*', '20%', '15%', '15%', '15%'];
    }
  }

  private getTableHeader(status: TaskStatus): any[] {
    const base = [
      { text: 'TAREA',    style: 'tableHeader' },
      { text: 'DESCRIPCIÓN', style: 'tableHeader' },
    ];

    switch (status) {
      case 'sin_asignar':
        return base;
      case 'asignada':
        return [
          ...base,
          { text: 'USUARIO',         style: 'tableHeader' },
          { text: 'FECHA ASIGNACIÓN', style: 'tableHeader' },
        ];
      case 'en_proceso':
        return [
          ...base,
          { text: 'USUARIO',     style: 'tableHeader' },
          { text: 'ESTIMACIÓN',  style: 'tableHeader' },
        ];
      case 'finalizada':
        return [
          ...base,
          { text: 'USUARIO',     style: 'tableHeader' },
          { text: 'ESTIMADO',    style: 'tableHeader' },
          { text: 'REAL',        style: 'tableHeader' },
        ];
    }
  }

  private buildTaskRow(task: TaskReport, status: TaskStatus, index: number): any[] {
    const nameCell = { text: task.name, style: 'taskName' };
    const descCell = { text: task.description || '—', style: 'taskDesc' };

    const userCell = {
      stack: [
        { text: task.assignedUser?.name  ?? '—', style: 'taskName' },
        { text: task.assignedUser?.email ?? '',   style: 'taskDesc' },
      ],
    };

    switch (status) {
      case 'sin_asignar':
        return [nameCell, descCell];

      case 'asignada':
        return [
          nameCell,
          descCell,
          userCell,
          { text: task.assignedAt ? this.formatDate(task.assignedAt) : '—', style: 'taskDesc' },
        ];

      case 'en_proceso':
        return [
          nameCell,
          descCell,
          userCell,
          { text: task.estimatedHours ? `${task.estimatedHours}h` : 'Sin estimar', style: 'taskDesc' },
        ];

      case 'finalizada': {
        const diff =
          task.actualHours && task.estimatedHours
            ? task.actualHours - task.estimatedHours
            : null;

        return [
          nameCell,
          descCell,
          userCell,
          { text: task.estimatedHours ? `${task.estimatedHours}h` : '—',  style: 'taskDesc' },
          {
            text:  task.actualHours ? `${task.actualHours}h` : '—',
            style: 'taskDesc',
            color: diff === null ? this.colors.text
                 : diff > 0     ? '#DC2626'
                 :                '#16A34A',
          },
        ];
      }
    }
  }

  // Estilos
  private buildStyles() {
    return {
      coverLabel:      { fontSize: 9,  color: '#93C5FD', bold: true, margin: [0, 0, 0, 6] },
      coverTitle:      { fontSize: 22, color: '#FFFFFF', bold: true, margin: [0, 0, 0, 6] },
      coverDesc:       { fontSize: 10, color: '#CBD5E1' },
      pageHeader:      { fontSize: 8,  color: this.colors.muted, bold: true },
      pageHeaderMuted: { fontSize: 8,  color: this.colors.muted },
      footerText:      { fontSize: 7,  color: this.colors.muted },
      sectionTitle:    { fontSize: 13, bold: true, color: this.colors.text },
      statusTitle:     { fontSize: 11, bold: true },
      summaryNumber:   { fontSize: 22, bold: true },
      summaryLabel:    { fontSize: 7,  color: this.colors.muted, margin: [0, 4, 0, 0] },
      tableHeader:     { fontSize: 8,  bold: true, color: '#FFFFFF', margin: [4, 6, 4, 6] },
      taskName:        { fontSize: 8,  bold: true, margin: [4, 5, 4, 2] },
      taskDesc:        { fontSize: 8,  color: this.colors.muted, margin: [4, 2, 4, 5] },
      mutedText:       { fontSize: 8,  color: this.colors.muted },
    };
  }

  // Helpers
  private groupByStatus(tasks: TaskReport[]): Record<TaskStatus, TaskReport[]> {
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    }, {} as Record<TaskStatus, TaskReport[]>);
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(new Date(date));
  }
}
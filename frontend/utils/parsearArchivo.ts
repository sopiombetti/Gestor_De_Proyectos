import * as XLSX from 'xlsx';

export type FilaTarea = {
  titulo: string;
  descripcion: string;
  prioridad: string;
  email?: string;
};


function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

export async function parsearArchivoTareas(file: File): Promise<FilaTarea[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const hoja = workbook.Sheets[workbook.SheetNames[0]];


  const filas = XLSX.utils.sheet_to_json<Record<string, unknown>>(hoja, { defval: '' });

  return filas
    .map((fila) => {

      const f: Record<string, unknown> = {};
      for (const clave of Object.keys(fila)) f[normalizar(clave)] = fila[clave];

      return {
        titulo: String(f['titulo'] ?? '').trim(),
        descripcion: String(f['descripcion'] ?? '').trim(),
        prioridad: String(f['prioridad'] ?? '').trim(),
        email: f['email'] ? String(f['email']).trim() : undefined,
      };
    })
    .filter((f) => f.titulo || f.descripcion || f.prioridad || f.email);
}
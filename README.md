# Gestor de Proyectos

Aplicación cliente-servidor para la gestión de proyectos, tareas y usuarios — **Programación III**.

Permite registrar usuarios, autenticarse con JWT, administrar proyectos y tareas, asignar colaboradores, cargar tareas de forma masiva desde un archivo Excel/CSV, y generar un informe del proyecto en PDF.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | NestJS 11 · TypeORM · PostgreSQL · JWT · bcrypt |
| Frontend | Next.js 16 · React · Tailwind CSS · SheetJS (xlsx) |
| Documentación API | Swagger (OpenAPI) |
| Tests | Jest |

---

## Requisitos previos

Antes de empezar, asegurate de tener instalado:

- **Node.js 20+** (incluye `npm`)
- **PostgreSQL 14+** (con acceso a `psql` o pgAdmin)

---

## 1. Base de datos

El backend usa PostgreSQL. Solo hace falta **crear la base vacía**; las tablas se generan automáticamente al arrancar (TypeORM con `synchronize: true`), y los **estados** y **prioridades** se cargan solos mediante un *seeder*.

Creá la base de datos:

```sql
CREATE DATABASE gestor_proyectos;
```

### Credenciales por defecto

El backend está configurado (en `backend/src/app.module.ts`) para conectarse con:

| Parámetro | Valor |
|-----------|-------|
| host | `localhost` |
| puerto | `5432` |
| usuario | `postgres` |
| contraseña | `123456` |
| base de datos | `gestor_proyectos` |

> ⚠️ Si tu instalación de PostgreSQL usa otra contraseña o usuario, editá esos valores en `backend/src/app.module.ts` antes de levantar el backend.

---

## 2. Backend

```bash
cd backend
npm install
npm run start:dev
```

El servidor queda corriendo en **http://localhost:3000**.

Al iniciar, el seeder carga automáticamente los estados (Sin asignar, Asignada, En progreso, Finalizada) y las prioridades (Baja, Media, Alta).

### Documentación de la API (Swagger)

Con el backend corriendo, la documentación interactiva está disponible en:

**http://localhost:3000/docs**

Desde ahí se pueden ver y probar todos los endpoints. Para los endpoints protegidos, usá el botón **Authorize** y pegá el token JWT que devuelve el login (ver más abajo).

---

## 3. Frontend

En **otra terminal** (dejá el backend corriendo):

```bash
cd frontend
npm install
npm run dev -- -p 3001 (Si el back ya está correindo, automáticamente el front corre en 3001, por lo que se puede usar solo npm run dev)
```

La aplicación queda disponible en **http://localhost:3001**.

> Se usa el puerto **3001** porque el backend ocupa el 3000.

---

## 4. Crear un usuario administrador

El registro crea usuarios **colaboradores** por defecto. Para probar las funciones de administración (crear proyectos, carga masiva, generar informes) necesitás un usuario **administrador**.

1. Registrate normalmente desde la app (o desde Swagger con `POST /usuarios`).
2. Promové ese usuario a administrador con esta consulta SQL:

```sql
UPDATE usuarios SET rol_admin = true WHERE email = 'tu_correo@ejemplo.com';
```

3. Cerrá sesión y volvé a iniciar sesión para que el nuevo rol tome efecto en el token.

---

## 5. Cómo probar la aplicación

Flujo sugerido de prueba:

1. **Registro** — Creá una cuenta (nombre, apellido, email, contraseña de mínimo 8 caracteres con al menos un número).
2. **Login** — Iniciá sesión; el sistema guarda el token JWT.
3. **Panel de administración** (con el usuario admin) — Accedé a `/admin`.
4. **Crear proyecto** — Botón "Crear Proyecto". Completá título y descripción.
5. **Carga masiva de tareas** — En el mismo formulario, adjuntá un archivo `.xlsx` o `.csv` (ver formato abajo). El backend valida fila por fila y, si hay errores, los muestra en pantalla con el detalle de cada fila.
6. **Visualizar tareas** — Iniciá sesión con un usuario colaborador para ver sus tareas asignadas; se pueden filtrar por prioridad.
7. **Cambiar estado / estimar** — Sobre una tarea, cambiá su estado o cargá la estimación.
8. **Generar informe** — Desde un proyecto, generá el informe PDF (`GET /reportes/proyectos/:id`).

---

## 6. Formato del archivo para la carga masiva

El archivo Excel/CSV debe tener en la **primera fila** estos encabezados (no distingue mayúsculas ni acentos):

| titulo | descripcion | prioridad | email |
|--------|-------------|-----------|-------|
| Diseñar modelo de datos | Definir entidades | Alta | colaborador@ejemplo.com |
| Endpoint de login | JWT + bcrypt | Alta | |

- **titulo, descripcion, prioridad**: obligatorios.
- **prioridad**: debe ser una de las existentes (`Baja`, `Media`, `Alta`).
- **email**: opcional. Si se completa, debe corresponder a un usuario existente; la tarea queda **Asignada**. Si se deja vacío, queda **Sin asignar**.
- Los títulos son únicos por proyecto.

---

## 7. Tests

Desde la carpeta `backend`:

```bash
npm run test        # corre toda la suite de tests unitarios
npm run test:cov    # corre los tests con reporte de cobertura
```

La suite cubre guards (JWT/Admin), el patrón State de las tareas, los servicios y los controllers (cobertura ~99%).

---

## 8. Documentación adicional

En la carpeta `documentacion/` se encuentran:

- `Requisitos_funcionales.md` — Especificación de requerimientos funcionales y no funcionales, con matriz de trazabilidad.
- `EntityRelationshipDiagram.uml` — Diagrama entidad-relación (DER) en PlantUML.
- `WorkBreakdownStructure.md` / `.uml` — Estructura de desglose del trabajo (WBS).
- `HISTORIAS-DE-USUARIO.xlsx` — Historias de usuario.

> Los diagramas `.uml` se visualizan en https://www.plantuml.com/plantuml o con la extensión *PlantUML* de VS Code.

---

## Nota

Este es un proyecto académico pensado para ejecución **local**. Las credenciales de base de datos y el secreto JWT están definidos directamente en el código por simplicidad y no deben usarse en un entorno productivo.

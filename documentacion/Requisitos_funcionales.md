# 📋 Sistema de Gestión de Proyectos (Cliente-Servidor)

> **Proyecto:** Sistema de Gestión de Proyectos

> **Versión del documento:** 1.0

> **Fecha:** 2025-05-21

> **Autor(es):** Diana Alali, Francisco Garcete, José Luis Minera, Sofía Piombetti

> **Estado:** `En revisión`

---

## Control de Versiones del Documento

| Versión | Fecha      | Autor                        | Descripción del Cambio        |
|---------|------------|------------------------------|-------------------------------|
| 1.0     | 2025-05-21 | Programación III             | Versión inicial               |

---

## Requerimientos Funcionales

> Los requerimientos funcionales describen **qué debe hacer** el sistema: comportamientos, funciones y servicios que el sistema debe proveer.

---

### RF-001 — Registro de Usuarios

| Campo         | Detalle         |
|---------------|-----------------|
| **ID**        | RF-001          |
| **Nombre**    | Registro de Usuarios |
| **Tipo**      | Funcional       |
| **Prioridad** | `Media`         |
| **Estado**    | `En desarrollo` |

#### Descripción

El sistema debe permitir a los usuarios crearse un perfil con un email y contraseña válidos, indicando tambén nombre completo y rol de trabajo. Los datos serán almacenados en la base de datos.

#### Criterios de Aceptación
- [x] EL mail debe contener un formato válido.
- [X] La contraseña debe contener al menos 8 caracteres, incluyendo al menos un número.
- [X] Se debe informar al usuario mediante un mensaje de error si algunos de los campos no cumple los requisitos.
- [x] Las contraseñas nunca se transmiten ni almacenan en texto plano; se usa hashing con `bcrypt` (mínimo 12 rondas).

#### Supuestos
- **SA-001:** El cliente siempre establece la comunicación con el servidor mediante HTTPS; no se admiten conexiones HTTP sin cifrar.
- **SA-002:** El usuario no debe existir previamente en la base de datos.
- **SA-003:** El servidor de base de datos que almacena las credenciales está disponible y accesible desde el servidor de autenticación en la red interna.

#### Dependencias

| ID Dependencia | Tipo            | Descripción                                                       |
|----------------|-----------------|-------------------------------------------------------------------|
| —              | Infraestructura | Servidor de base de datos relacional (PostgreSQL) disponible y accesible.   |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación   | Descripción                                              |
|----------------|--------------------|----------------------------------------------------------|
| RF-002         | `Incluye`          | RF-002 requiere que el proceso de RF-001 (Registro de Usuarios) se haya ejecutado previamente. |
| RF-003         | `Condiciona`       | RF-003 (Mostrar Tareas) solo es accesible si RF-001 está completado.|
| RNF-001        | `Condicionado por` | El cifrado en tránsito definido en RNF-001 es un prerrequisito de seguridad para este RF. |

---

### RF-002 — Autenticación de usuarios

| Campo         | Detalle         |
|---------------|-----------------|
| **ID**        | RF-002          |
| **Nombre**    | Autenticación de Usuarios |
| **Tipo**      | Funcional       |
| **Prioridad** | `Media`         |
| **Estado**    | `En desarrollo` |

#### Descripción

El sistema debe permitir a los usuarios iniciar sesión con email y contraseña. El servidor debe validar las credenciales del usuario recibidas desde el cliente, y emitir un token JWT con tiempo de expiración de 60 minutos si las credenciales son correctas, o retornar un mensaje de error estandarizado si no lo son.

#### Criterios de Aceptación
- [x] El servidor retorna un token JWT válido ante credenciales correctas en menos de 2 segundos.
- [x] El servidor retorna el código HTTP `401 Unauthorized` y un mensaje descriptivo ante credenciales incorrectas.
- [x] Después de 5 intentos fallidos consecutivos, el servidor bloquea la cuenta temporalmente durante 10 minutos y notifica al usuario.
- [x] Las contraseñas nunca se transmiten ni almacenan en texto plano; se usa hashing con `bcrypt` (mínimo 12 rondas).

#### Supuestos
- **SA-001:** El cliente siempre establece la comunicación con el servidor mediante HTTPS; no se admiten conexiones HTTP sin cifrar.
- **SA-002:** El usuario ya fue registrado previamente en el sistema.
- **SA-003:** El servidor de base de datos que almacena las credenciales está disponible y accesible desde el servidor de autenticación en la red interna.

#### Dependencias

| ID Dependencia | Tipo            | Descripción                                                       |
|----------------|-----------------|-------------------------------------------------------------------|
| RF-001         | Requerimiento   | El registro de usuarios (RF-001) debe haberse completado antes de que un usuario pueda autenticarse. |
| RNF-002        | Requerimiento   | La comunicación debe cumplir el requerimiento de seguridad en tránsito (RNF-002). |
| —              | Infraestructura | Servidor de base de datos relacional (PostgreSQL) disponible y accesible.   |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación   | Descripción                                              |
|----------------|--------------------|----------------------------------------------------------|
| RF-001         | `Incluye`          | RF-002 requiere que el proceso de RF-001 (Registro de Usuarios) se haya ejecutado previamente. |
| RF-003         | `Condiciona`       | RF-003 (Mostrar Tareas) solo es accesible si RF-002 fue ejecutado previamente.|
| RNF-001        | `Condicionado por` | El cifrado en tránsito definido en RNF-002 es un prerrequisito de seguridad para este RF. |

---

### RF-003 — Mostrar Tareas

| Campo         | Detalle         |
|---------------|-----------------|
| **ID**        | RF-003          |
| **Nombre**    | Mostrar Tareas  |
| **Tipo**      | Funcional       |
| **Prioridad** | `Alta`          |
| **Estado**    | `En desarrollo` |

#### Descripción

El sistema debe permitir a los usuarios ver en la página de inicio un listado de las tareas que le fueron asignadas.

#### Criterios de Aceptación
- [x] Cada tarea que se muestra incluye id, nombre, prioridad y estado.
- [x] El id_usuario de cada tarea que se muestra debe ser correspondiente al usuario logeado.

#### Supuestos
- **SA-001:** El usuario ya fue autenticado previamente en el sistema.
- **SA-002:** Las tareas ya fueron asignadas previamente.

#### Dependencias

| ID Dependencia | Tipo            | Descripción                                                       |
|----------------|-----------------|-------------------------------------------------------------------|
| RF-002         | Requerimiento   | La autenticación de usuarios (RF-002) debe haberse completado.    |
| RF-009         | Requerimiento   | El administrador debe haber creado previamente un proyecto.       | 
| —              | Infraestructura | Servidor de base de datos relacional (PostgreSQL) disponible y accesible.   |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación   | Descripción                                              |
|----------------|--------------------|----------------------------------------------------------|
| RF-002         | `Incluye`          | RF-003 requiere que el proceso de RF-002 (Autenticación de Usuarios) se haya ejecutado previamente. |
| RF-009         | `Condiciona`       | RF-003 requiere que el proceso de RF-009 (Crear Proyeto) se haya ejecutado previamente. |
| RF-011         | `Condiciona`       | RF-003 requiere que el proceso de RF-011 (Asignar Tareas) se haya ejecutado previamente. |

---

### RF-005 — Estimar Tareas

| Campo         | Detalle         |
|---------------|-----------------|
| **ID**        | RF-005          |
| **Nombre**    | Estimar Tareas  |
| **Tipo**      | Funcional       |
| **Prioridad** | `Alta`          |
| **Estado**    | `En desarrollo` |

#### Descripción

El sistema debe permitir a los usuarios realizar una estimación de tiempo de cada tarea. El usuario debe ingresar tres valores, tiempo probable, optimista y pesimista, y el sistema calcula la estimación real, almacenándola en la base de datos.

#### Criterios de Aceptación
- [x] El botón para realizar la estimación se encuentra en el detalle de cada tarea.
- [x] El sistema utiliza la fórmula de PERT para realizar el cálculo.
- [x] Se valida que los valores ingresados son válidos.

#### Supuestos
- **SA-001:** El usuario ya fue autenticado previamente en el sistema.
- **SA-002:** Las tareas ya fueron asignadas previamente.

#### Dependencias

| ID Dependencia | Tipo            | Descripción                                                       |
|----------------|-----------------|-------------------------------------------------------------------|
| RF-002         | Requerimiento   | La autenticación de usuarios (RF-002) debe haberse completado.    |
| RF-009         | Requerimiento   | El administrador debe haber creado previamente un proyecto.       | 
| —              | Infraestructura | Servidor de base de datos relacional (PostgreSQL) disponible y accesible.   |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación   | Descripción                                              |
|----------------|--------------------|----------------------------------------------------------|
| RF-002         | `Incluye`          | RF-005 requiere que el proceso de RF-002 (Autenticación de Usuarios) se haya ejecutado previamente. |
| RF-009         | `Condiciona`       | RF-005 requiere que el proceso de RF-009 (Crear Proyeto) se haya ejecutado previamente. |
| RF-011         | `Condiciona`       | RF-005 requiere que el proceso de RF-011 (Asignar Tareas) se haya ejecutado previamente. |
| RF-003         | `Condiciona`       | RF-005 requiere que el proceso de RF-003 (Mostrar Tareas) se haya ejecutado previamente. |

---

### RF-006 — Cambiar de Estado

| Campo         | Detalle           |
|---------------|-------------------|
| **ID**        | RF-006            |
| **Nombre**    | Cambiar de Estado |
| **Tipo**      | Funcional         |
| **Prioridad** | `Alta`            |
| **Estado**    | `En desarrollo`   |

#### Descripción

El sistema debe permitir a los usuarios cambiar el estado de una tarea entre 'Asignada', 'En Proceso', 'En Revisión' y 'Finalizada'.

#### Criterios de Aceptación
- [x] El botón para realizar el cambio de estado se encuentra en el detalle de cada tarea.
- [x] Se actualiza el estado en la base de datos.

#### Supuestos
- **SA-001:** El usuario ya fue autenticado previamente en el sistema.
- **SA-002:** Las tareas ya fueron asignadas previamente.
- **SA-003:** Las tareas ya fueron creadas con un estado inicial 'Asignada'.

#### Dependencias

| ID Dependencia | Tipo            | Descripción                                                       |
|----------------|-----------------|-------------------------------------------------------------------|
| RF-002         | Requerimiento   | La autenticación de usuarios (RF-002) debe haberse completado.    |
| RF-009         | Requerimiento   | El administrador debe haber creado previamente un proyecto.       | 
| —              | Infraestructura | Servidor de base de datos relacional (PostgreSQL) disponible y accesible.   |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación   | Descripción                                              |
|----------------|--------------------|----------------------------------------------------------|
| RF-002         | `Incluye`          | RF-005 requiere que el proceso de RF-002 (Autenticación de Usuarios) se haya ejecutado previamente. |
| RF-009         | `Condiciona`       | RF-005 requiere que el proceso de RF-009 (Crear Proyeto) se haya ejecutado previamente. |
| RF-011         | `Condiciona`       | RF-005 requiere que el proceso de RF-011 (Asignar Tareas) se haya ejecutado previamente. |
| RF-003         | `Condiciona`       | RF-005 requiere que el proceso de RF-003 (Mostrar Tareas) se haya ejecutado previamente. |
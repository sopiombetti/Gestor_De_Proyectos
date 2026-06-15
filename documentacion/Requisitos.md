# 📋 Sistema de Gestión de Proyectos (Cliente-Servidor)

> **Proyecto:** Sistema de Gestión de Proyectos

> **Versión del documento:** 1.1

> **Fecha:** 2026-06-15

> **Autor(es):** Diana Alali, Francisco Garcete, Sofía Piombetti

> **Estado:** `Validado`

---

## Control de Versiones del Documento

| Versión | Fecha      | Autor                        | Descripción del Cambio        |
|---------|------------|------------------------------|-------------------------------|
| 1.0     | 2026-05-21 | Programación III             | Versión inicial               |
| 1.1     | 2026-06-15 | Diana Alali, Francisco Garcete, Sofía Piombetti | Correcciones de redacción, referencias internas (RF-012) y nombres de estados de tarea |

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

El sistema debe permitir a los usuarios crearse un perfil con un email y contraseña válidos, indicando también nombre completo y rol de trabajo. Los datos serán almacenados en la base de datos.

#### Criterios de Aceptación
- [x] El mail debe tener un formato válido.
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
- [ ] Después de 5 intentos fallidos consecutivos, el servidor bloquea la cuenta temporalmente durante 10 minutos y notifica al usuario. _(Fuera del alcance de esta entrega)_
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
- [x] El id_usuario de cada tarea que se muestra debe ser correspondiente al usuario logueado.

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
| RF-009         | `Condiciona`       | RF-003 requiere que el proceso de RF-009 (Crear Proyecto) se haya ejecutado previamente. |
| RF-012         | `Condiciona`       | RF-003 requiere que el proceso de RF-012 (Asignación de Tareas) se haya ejecutado previamente. |

---

### RF-004 — Filtrado de Tareas por Prioridad

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RF-004 |
| **Nombre**       | Filtrado de Tareas por Prioridad |
| **Tipo**         | Funcional |
| **Prioridad**    | `Media` |
| **Estado**       | `Pendiente` |

#### Descripción

El sistema debe permitir a los usuarios filtrar las tareas por prioridad.

#### Criterios de Aceptación

- [x] El usuario debe seleccionar un nivel de prioridad.
- [x] El sistema debe mostrar únicamente tareas correspondientes al filtro.
- [x] El usuario debe poder limpiar el filtro aplicado.

#### Supuestos

- **SA-001:** Las tareas poseen un nivel de prioridad definido.
- **SA-002:** Existen tareas registradas en el sistema.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RF-003         | Requerimiento  | Requiere visualizar tareas previamente |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                  |
|----------------|----------------------|----------------------------------------------|
| RF-003         | `Extiende`           | Amplía la visualización de tareas |

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
| RF-009         | `Condiciona`       | RF-005 requiere que el proceso de RF-009 (Crear Proyecto) se haya ejecutado previamente. |
| RF-012         | `Condiciona`       | RF-005 requiere que el proceso de RF-012 (Asignación de Tareas) se haya ejecutado previamente. |
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

El sistema debe permitir a los usuarios cambiar el estado de una tarea entre 'Sin asignar', 'Asignada', 'En progreso' y 'Finalizada'.

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
| RF-002         | `Incluye`          | RF-006 requiere que el proceso de RF-002 (Autenticación de Usuarios) se haya ejecutado previamente. |
| RF-003         | `Condiciona`       | RF-006 requiere que el proceso de RF-003 (Mostrar Tareas) se haya ejecutado previamente. |
| RF-012         | `Condiciona`       | RF-006 requiere que el proceso de RF-012 (Asignación de Tareas) se haya ejecutado previamente. |
| RF-015         | `Complementa`      | Los estados gestionados por RF-006 son utilizados por RF-015 (Generación de Informe de Progreso). |

---

### RF-007 — Gestión de Roles

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RF-007 |
| **Nombre**       | Gestión de Roles |
| **Tipo**         | Funcional |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

El sistema debe permitir diferenciar roles (administrador, colaborador).


#### Criterios de Aceptación

- [x] El sistema debe asignar un rol a cada usuario.
- [x] El sistema debe restringir funcionalidades según el rol.
- [x] Los roles deben persistir correctamente.

#### Supuestos

- **SA-001:** Los usuarios poseen autenticación válida.
- **SA-002:** Los permisos están correctamente configurados.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RF-001         | Requerimiento  | Los usuarios deben existir previamente |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                  |
|----------------|----------------------|----------------------------------------------|
| RF-008         | `Incluye`            | El acceso al panel depende del rol |

---

### RF-008 — Acceso al Panel de Administración

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RF-008 |
| **Nombre**       | Acceso al Panel de Administración |
| **Tipo**         | Funcional |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

El sistema debe permitir a los usuarios administradores acceder al panel administración.


#### Criterios de Aceptación

- [x] Solo los usuarios administradores deben acceder al panel.
- [x] El sistema debe bloquear accesos no autorizados.
- [x] El panel debe mostrar herramientas administrativas.

#### Supuestos

- **SA-001:** El usuario inició sesión correctamente.
- **SA-002:** El usuario posee rol administrador.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RF-007         | Requerimiento  | Requiere gestión de roles |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                  |
|----------------|----------------------|----------------------------------------------|
| RF-009         | `Incluye`            | La creación de proyectos ocurre desde el panel |

---

### RF-009 — Creación de Proyectos

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RF-009 |
| **Nombre**       | Creación de Proyectos |
| **Tipo**         | Funcional |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

El sistema debe permitir a los usuarios administradores crear un nuevo proyecto.


#### Criterios de Aceptación

- [x] El administrador debe ingresar información básica del proyecto.
- [x] El sistema debe almacenar el proyecto correctamente.
- [x] El proyecto creado debe visualizarse en el sistema.

#### Supuestos

- **SA-001:** El usuario posee permisos de administrador.
- **SA-002:** La base de datos se encuentra disponible.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RF-008         | Requerimiento  | Acceso al panel administrativo |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                  |
|----------------|----------------------|----------------------------------------------|
| RF-010         | `Extiende`           | Los proyectos creados pueden editarse |

---

### RF-010 — Edición de Proyectos

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RF-010 |
| **Nombre**       | Edición de Proyectos |
| **Tipo**         | Funcional |
| **Prioridad**    | `Media` |
| **Estado**       | `Pendiente` |

#### Descripción

El sistema debe permitir editar la información de un proyecto.


#### Criterios de Aceptación

- [x] El administrador debe modificar los datos del proyecto.
- [x] Los cambios deben guardarse correctamente.
- [x] El sistema debe reflejar la información actualizada.

#### Supuestos

- **SA-001:** El proyecto existe previamente.
- **SA-002:** El usuario posee permisos de edición.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RF-009         | Requerimiento  | El proyecto debe existir previamente |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                  |
|----------------|----------------------|----------------------------------------------|
| RF-009         | `Extiende`           | Amplía la gestión de proyectos |

---

### RF-011 — Importación de Tareas desde CSV

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RF-011 |
| **Nombre**       | Importación de Tareas desde CSV |
| **Tipo**         | Funcional |
| **Prioridad**    | `Media` |
| **Estado**       | `Pendiente` |

#### Descripción

El sistema debe permitir a los usuarios administradores subir un archivo .csv y crear las tareas a partir del mismo.


#### Criterios de Aceptación

- [x] El administrador debe subir un archivo CSV válido.
- [x] El sistema debe procesar y crear las tareas correctamente.
- [x] El sistema debe informar errores de formato.

#### Supuestos

- **SA-001:** El archivo posee el formato esperado.
- **SA-002:** El usuario tiene permisos administrativos.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RF-009         | Requerimiento  | Las tareas deben asociarse a un proyecto |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                  |
|----------------|----------------------|----------------------------------------------|
| RF-012         | `Complementa`        | Las tareas importadas pueden asignarse |

---

### RF-012 — Asignación de Tareas

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RF-012 |
| **Nombre**       | Asignación de Tareas |
| **Tipo**         | Funcional |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

El sistema debe permitir a los usuarios administradores asignar tareas del proyecto a colaboradores.


#### Criterios de Aceptación

- [x] El administrador debe seleccionar una tarea y un colaborador.
- [x] El sistema debe registrar la asignación correctamente.
- [x] El colaborador debe visualizar la tarea asignada.

#### Supuestos

- **SA-001:** Existen colaboradores registrados.
- **SA-002:** Existen tareas disponibles para asignar.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RF-007         | Requerimiento  | Requiere gestión de roles |
| RF-011         | Requerimiento  | Las tareas pueden haberse importado |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                  |
|----------------|----------------------|----------------------------------------------|
| RF-003         | `Incluye`            | Las tareas asignadas deben visualizarse |

---

### RF-013 — Registro de Fechas

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RF-013 |
| **Nombre**       | Registro de Fechas |
| **Tipo**         | Funcional |
| **Prioridad**    | `Media` |
| **Estado**       | `Pendiente` |

#### Descripción

El sistema debe permitir registrar la fecha de creación de un proyecto y la fecha de asignación de una tarea.


#### Criterios de Aceptación

- [x] El sistema debe almacenar automáticamente las fechas.
- [x] Las fechas deben visualizarse correctamente.
- [x] Las fechas no deben modificarse manualmente sin permisos.

#### Supuestos

- **SA-001:** El sistema posee configuración horaria correcta.
- **SA-002:** Existen proyectos y tareas registrados.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RF-009         | Requerimiento  | Requiere proyectos registrados |
| RF-012         | Requerimiento  | Requiere asignación de tareas |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                  |
|----------------|----------------------|----------------------------------------------|
| RF-015         | `Complementa`        | El informe utiliza fechas registradas |


---

### RF-014 — Edición de Tareas

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RF-014 |
| **Nombre**       | Edición de Tareas |
| **Tipo**         | Funcional |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción


El sistema debe permitir editar tareas.


#### Criterios de Aceptación

- [x] El usuario autorizado debe modificar información de tareas.
- [x] Los cambios deben persistir correctamente.
- [x] El sistema debe validar los datos ingresados.

#### Supuestos

- **SA-001:** La tarea existe previamente.
- **SA-002:** El usuario posee permisos de edición.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RF-003         | Requerimiento  | La tarea debe existir previamente |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                  |
|----------------|----------------------|----------------------------------------------|
| RF-005         | `Incluye`            | Puede incluir edición de estimaciones |
| RF-006         | `Incluye`            | Puede incluir edición de estados |

---

### RF-015 — Generación de Informe de Progreso

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RF-015 |
| **Nombre**       | Generación de Informe de Progreso |
| **Tipo**         | Funcional |
| **Prioridad**    | `Media` |
| **Estado**       | `Pendiente` |

#### Descripción

El sistema debe permitir generar un informe de progreso del proyecto.


#### Criterios de Aceptación

- [x] El sistema debe generar un resumen del estado del proyecto.
- [x] El informe debe incluir tareas completadas y pendientes.
- [x] El usuario debe poder visualizar o descargar el informe.

#### Supuestos

- **SA-001:** Existen proyectos y tareas registradas.
- **SA-002:** El usuario posee permisos para visualizar informes.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RF-006         | Requerimiento  | El informe depende del estado de tareas |
| RF-013         | Requerimiento  | El informe utiliza fechas registradas |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                  |
|----------------|----------------------|----------------------------------------------|
| RF-006         | `Incluye`            | Utiliza estados de tareas |
| RF-013         | `Incluye`            | Utiliza fechas registradas |

## Requerimientos No Funcionales

> Los requerimientos no funcionales describen **cómo debe comportarse** el sistema: restricciones de calidad, rendimiento, seguridad y otras propiedades del sistema.

---

### RNF-001 — Tiempo de Respuesta del Sistema

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RNF-001 |
| **Nombre**       | Tiempo de Respuesta del Sistema |
| **Tipo**         | No Funcional |
| **Categoría**    | `Rendimiento` |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

> El sistema debe garantizar que las solicitudes realizadas por los usuarios sean procesadas en un tiempo de respuesta menor a 2 segundos bajo condiciones normales de operación, asegurando una experiencia fluida y eficiente.

```
El sistema debe responder a las solicitudes en menos de 2 segundos bajo condiciones normales.
```

#### Criterios de Aceptación / Métricas

- [x] El tiempo promedio de respuesta debe ser menor a 2 segundos.
- [x] El 95% de las solicitudes debe completarse en menos de 2 segundos.
- [x] Método de verificación: pruebas de rendimiento y monitoreo.

#### Supuestos

> Condiciones que se asumen como verdaderas para que este requerimiento sea aplicable.

- **SA-001:** La infraestructura cuenta con recursos suficientes.
- **SA-002:** La conexión de red opera dentro de parámetros normales.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| —              | Infraestructura| Servidor y base de datos correctamente configurados |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                    |
|----------------|----------------------|------------------------------------------------|
| RNF-005        | `Complementa`        | Ambos requerimientos impactan el rendimiento del sistema |


---

### RNF-002 — Seguridad de Contraseñas

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RNF-002 |
| **Nombre**       | Seguridad de Contraseñas |
| **Tipo**         | No Funcional |
| **Categoría**    | `Seguridad` |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

> El sistema debe proteger la información sensible de los usuarios almacenando las contraseñas mediante mecanismos seguros de cifrado o hashing, evitando su exposición en texto plano.

```
El sistema debe almacenar las contraseñas de los usuarios de forma encriptada.
```

#### Criterios de Aceptación / Métricas

- [x] Las contraseñas no deben almacenarse en texto plano.
- [x] Debe utilizarse un algoritmo seguro de encriptación como bcrypt.
- [x] Método de verificación: auditoría de seguridad y revisión de código.

#### Supuestos

> Condiciones que se asumen como verdaderas para que este requerimiento sea aplicable.

- **SA-001:** El sistema contará con librerías criptográficas actualizadas.
- **SA-002:** Los desarrolladores aplicarán buenas prácticas de seguridad.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| —              | Externo        | Librería de cifrado/hashing |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                    |
|----------------|----------------------|------------------------------------------------|
| RNF-007        | `Complementa`        | Los tests automatizados deben validar la seguridad |


---

### RNF-003 — Facilidad de Registro de Usuarios

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RNF-003 |
| **Nombre**       | Facilidad de Registro de Usuarios |
| **Tipo**         | No Funcional |
| **Categoría**    | `Usabilidad` |
| **Prioridad**    | `Media` |
| **Estado**       | `Pendiente` |

#### Descripción

> El sistema debe ofrecer un proceso de registro simple e intuitivo, permitiendo que un usuario complete el alta de cuenta en menos de 5 clics.

```
El usuario debe poder registrarse en menos de 5 clics.
```

#### Criterios de Aceptación / Métricas

- [x] El flujo de registro no debe superar los 5 clics.
- [x] El usuario debe completar el registro sin asistencia externa.
- [x] Método de verificación: pruebas de usabilidad.

#### Supuestos

> Condiciones que se asumen como verdaderas para que este requerimiento sea aplicable.

- **SA-001:** El diseño de interfaz será simple e intuitivo.
- **SA-002:** El usuario cuenta con conexión estable a internet.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| —              | Infraestructura| Disponibilidad del frontend web |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                    |
|----------------|----------------------|------------------------------------------------|
| RNF-006        | `Complementa`        | La experiencia responsive mejora la usabilidad |


---

### RNF-004 — Escalabilidad de la Arquitectura

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RNF-004 |
| **Nombre**       | Escalabilidad de la Arquitectura |
| **Tipo**         | No Funcional |
| **Categoría**    | `Escalabilidad` |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

> La arquitectura del sistema debe estar diseñada de manera modular y escalable, permitiendo incorporar nuevas funcionalidades sin afectar el comportamiento de los componentes existentes.

```
La arquitectura debe permitir agregar nuevas funcionalidades sin afectar las existentes.
```

#### Criterios de Aceptación / Métricas

- [x] La incorporación de nuevas funcionalidades no debe requerir modificar módulos existentes.
- [x] La arquitectura debe seguir principios de modularidad y separación de responsabilidades.
- [x] Método de verificación: revisión arquitectura y análisis de impacto.

#### Supuestos

> Condiciones que se asumen como verdaderas para que este requerimiento sea aplicable.

- **SA-001:** El equipo seguirá patrones de diseño definidos.
- **SA-002:** El código fuente estará correctamente documentado.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RNF-007        | Requerimiento  | Los tests automatizados ayudan a validar cambios |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                    |
|----------------|----------------------|------------------------------------------------|
| RNF-007        | `Complementa`        | Los tests facilitan la mantenibilidad |


---

### RNF-005 — Soporte de Usuarios Concurrentes

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RNF-005 |
| **Nombre**       | Soporte de Usuarios Concurrentes |
| **Tipo**         | No Funcional |
| **Categoría**    | `Rendimiento` |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

> La aplicación debe mantener un rendimiento estable y tiempos de respuesta aceptables al soportar hasta 50 usuarios concurrentes utilizando el sistema simultáneamente.

```
La aplicación debe soportar hasta 50 usuarios concurrentes sin degradar la experiencia.
```

#### Criterios de Aceptación / Métricas

- [x] El sistema debe mantener tiempos de respuesta aceptables con 50 usuarios concurrentes.
- [x] No deben producirse caídas del servicio durante las pruebas de concurrencia.
- [x] Método de verificación: pruebas de carga.

#### Supuestos

> Condiciones que se asumen como verdaderas para que este requerimiento sea aplicable.

- **SA-001:** La infraestructura está correctamente dimensionada.
- **SA-002:** La base de datos soporta conexiones concurrentes adecuadamente.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| RNF-001        | Requerimiento  | El tiempo de respuesta depende de la carga concurrente |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                    |
|----------------|----------------------|------------------------------------------------|
| RNF-001        | `Complementa`        | Ambos requisitos evalúan el desempeño del sistema |

---

### RNF-006 — Compatibilidad Responsive

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RNF-006 |
| **Nombre**       | Compatibilidad Responsive |
| **Tipo**         | No Funcional |
| **Categoría**    | `Portabilidad` |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

> La interfaz de la aplicación debe adaptarse correctamente a diferentes tamaños de pantalla y dispositivos, garantizando compatibilidad y usabilidad en computadoras, tablets y celulares.

```
La aplicación debe ser responsive, siendo compatible con computadoras, tablets y celulares.
```


#### Criterios de Aceptación / Métricas

- [x] La interfaz debe adaptarse correctamente a distintos tamaños de pantalla.
- [x] Las funcionalidades principales deben estar disponibles en todos los dispositivos soportados.
- [x] Método de verificación: pruebas de compatibilidad y responsive design.

#### Supuestos

> Condiciones que se asumen como verdaderas para que este requerimiento sea aplicable.

- **SA-001:** Se utilizarán frameworks o técnicas de diseño responsive.
- **SA-002:** Los navegadores utilizados son versiones modernas y compatibles.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| —              | Infraestructura| Compatibilidad con navegadores modernos |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                    |
|----------------|----------------------|------------------------------------------------|
| RNF-003        | `Complementa`        | Mejora la experiencia de usuario |


---

### RNF-007 — Tests Automatizados

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RNF-007 |
| **Nombre**       | Tests Automatizados |
| **Tipo**         | No Funcional |
| **Categoría**    | `Mantenibilidad` |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

> El sistema debe contar con pruebas automatizadas que permitan validar el correcto funcionamiento de las funcionalidades principales y reducir errores durante el desarrollo y mantenimiento.

```
El sistema debe tener tests automatizados.
```

#### Criterios de Aceptación / Métricas

- [x] Deben existir tests unitarios y de integración.
- [x] La cobertura mínima de código debe ser del 80%.
- [x] Método de verificación: ejecución de prueba a través del framework Jest.

#### Supuestos

> Condiciones que se asumen como verdaderas para que este requerimiento sea aplicable.

- **SA-001:** El equipo utilizará herramientas de testing automatizado.


#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| —              | Infraestructura| Pipeline de CI/CD |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                    |
|----------------|----------------------|------------------------------------------------|
| RNF-004        | `Complementa`        | Facilita la evolución de la arquitectura |
| RNF-002        | `Complementa`        | Permite validar controles de seguridad |


---

### RNF-008 — Integridad de Tareas Asociadas a Proyectos

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RNF-008 |
| **Nombre**       | Integridad de Tareas Asociadas a Proyectos |
| **Tipo**         | No Funcional |
| **Categoría**    | `Otro` |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

> El sistema debe garantizar la integridad de los datos evitando la existencia de tareas que no estén asociadas a un proyecto válido registrado en el sistema.

```
No deben existir tareas sin proyecto asociado.
```

#### Criterios de Aceptación / Métricas

- [x] Toda tarea debe estar vinculada a un proyecto válido.
- [x] La base de datos debe impedir registros huérfanos.
- [x] Método de verificación: pruebas de integridad y restricciones en base de datos.

#### Supuestos

> Condiciones que se asumen como verdaderas para que este requerimiento sea aplicable.

- **SA-001:** La base de datos soporta claves foráneas.
- **SA-002:** Las validaciones se implementan tanto en frontend como backend.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| —              | Infraestructura| Motor de base de datos relacional |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                    |
|----------------|----------------------|------------------------------------------------|
| RNF-009        | `Complementa`        | Ambos garantizan integridad referencial |


---

### RNF-009 — Integridad de Asignación de Usuarios

| Campo            | Detalle |
|------------------|---------|
| **ID**           | RNF-009 |
| **Nombre**       | Integridad de Asignación de Usuarios |
| **Tipo**         | No Funcional |
| **Categoría**    | `Otro` |
| **Prioridad**    | `Alta` |
| **Estado**       | `Pendiente` |

#### Descripción

> El sistema debe asegurar la consistencia de las asignaciones impidiendo que una tarea pueda relacionarse con usuarios inexistentes dentro de la plataforma.

```
No deben existir tareas asignadas a usuarios inexistentes.
```

#### Criterios de Aceptación / Métricas

- [x] Toda asignación debe corresponder a un usuario válido.
- [x] La base de datos debe garantizar integridad referencial.
- [x] Método de verificación: pruebas funcionales y validaciones de base de datos.

#### Supuestos

> Condiciones que se asumen como verdaderas para que este requerimiento sea aplicable.

- **SA-001:** Los usuarios deben existir previamente en el sistema.
- **SA-002:** Las relaciones entre entidades estarán correctamente modeladas.

#### Dependencias

| ID Dependencia | Tipo           | Descripción                          |
|----------------|----------------|--------------------------------------|
| —              | Infraestructura| Base de datos con restricciones referenciales |

#### Relaciones con Otros Requerimientos

| ID Relacionado | Tipo de Relación     | Descripción                                    |
|----------------|----------------------|------------------------------------------------|
| RNF-008        | `Complementa`        | Ambos aseguran consistencia de datos |


---

## Matriz de Trazabilidad


> Permite visualizar las relaciones entre requerimientos funcionales y no funcionales, facilitando el seguimiento del impacto de cambios.

| ID Requerimiento | Nombre                                   | Tipo          | Depende de                | Relacionado con                | Prioridad | Estado        |
|------------------|-------------------------------------------|---------------|---------------------------|--------------------------------|-----------|---------------|
| RF-001           | Registro de Usuarios                      | Funcional     | RNF-002                   | RF-002, RNF-002               | Alta      | Pendiente     |
| RF-002           | Inicio de Sesión                          | Funcional     | RF-001, RNF-002           | RF-001                        | Alta      | Pendiente     |
| RF-003           | Visualización de Tareas Asignadas         | Funcional     | RF-002                    | RF-004                        | Alta      | Pendiente     |
| RF-004           | Filtrado de Tareas por Prioridad          | Funcional     | RF-003                    | RF-003                        | Media     | Pendiente     |
| RF-005           | Estimación de Tiempo de Tareas            | Funcional     | RF-003                    | RF-014                        | Media     | Pendiente     |
| RF-006           | Cambio de Estado de Tareas                | Funcional     | RF-003                    | RF-015                        | Alta      | Pendiente     |
| RF-007           | Gestión de Roles                          | Funcional     | RF-001                    | RF-008                        | Alta      | Pendiente     |
| RF-008           | Acceso al Panel de Administración         | Funcional     | RF-007                    | RF-009                        | Alta      | Pendiente     |
| RF-009           | Creación de Proyectos                     | Funcional     | RF-008                    | RF-010                        | Alta      | Pendiente     |
| RF-010           | Edición de Proyectos                      | Funcional     | RF-009                    | RF-009                        | Media     | Pendiente     |
| RF-011           | Importación de Tareas desde CSV           | Funcional     | RF-009                    | RF-012                        | Media     | Pendiente     |
| RF-012           | Asignación de Tareas                      | Funcional     | RF-007, RF-011            | RF-003                        | Alta      | Pendiente     |
| RF-013           | Registro de Fechas                        | Funcional     | RF-009, RF-012            | RF-015                        | Media     | Pendiente     |
| RF-014           | Edición de Tareas                         | Funcional     | RF-003                    | RF-005, RF-006               | Alta      | Pendiente     |
| RF-015           | Generación de Informe de Progreso         | Funcional     | RF-006, RF-013            | RF-006, RF-013               | Media     | Pendiente     |
| RNF-001          | Tiempo de Respuesta del Sistema              | No Funcional  | —           | RNF-005          | Alta      | Pendiente     |
| RNF-002          | Seguridad de Contraseñas                     | No Funcional  | —           | RNF-007          | Alta      | Pendiente     |
| RNF-003          | Facilidad de Registro de Usuarios            | No Funcional  | —           | RNF-006          | Media     | Pendiente     |
| RNF-004          | Escalabilidad de la Arquitectura             | No Funcional  | RNF-007    | RNF-007          | Alta      | Pendiente     |
| RNF-005          | Soporte de Usuarios Concurrentes             | No Funcional  | RNF-001    | RNF-001          | Alta      | Pendiente     |
| RNF-006          | Compatibilidad Responsive                    | No Funcional  | —           | RNF-003          | Alta      | Pendiente     |
| RNF-007          | Tests Automatizados                          | No Funcional  | —           | RNF-002, RNF-004 | Alta      | Pendiente     |
| RNF-008          | Integridad de Tareas Asociadas a Proyectos   | No Funcional  | —           | RNF-009          | Alta      | Pendiente     |
| RNF-009          | Integridad de Asignación de Usuarios         | No Funcional  | —           | RNF-008          | Alta      | Pendiente     |

---

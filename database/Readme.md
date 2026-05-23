README - Instalación y uso de PostgreSQL

Este documento explica cómo:

* Instalar PostgreSQL y pgAdmin
* Crear una base de datos llamada gestor_proyectos
* Exportar una base de datos
* Importar una base de datos


1. Descargar PostgreSQL
Descargar PostgreSQL desde el sitio oficial:
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

Descargar PostgreSQL
Durante la instalación:

Indicar como contraseña para el usuario postgres: 123456
Dejar el puerto por defecto:
5432


2. Abrir pgAdmin
Una vez instalado: Abrir pgAdmin
Ingresar la contraseña configurada durante la instalación


3. Registrar el servidor (si no aparece)
Si no aparece ningún servidor:
Click derecho en Servers
Seleccionar:
Register
Server...

En Pestaña General Completar:
- Name:Postgres Local

En Pestaña Connection Completar:
Host: localhost
Port: 5432
Maintenance database: postgres
Username: postgres
Password: 123456

Luego presionar:
Save


4. Crear la base de datos gestor_proyectos
Expandir Servers
Selecciona servidor Postgres Local
Click derecho sobre Databases
Seleccionar:Create Database...

Completar:
Database: gestor_proyectos

Owner: postgres

Presionar Save

La base quedará creada correctamente.


5. Exportar usando consola (opcional)
Inicialmente posicionarse en la carpeta database del proyecto y allí indicar en la terminal:

"/c/Program Files/PostgreSQL/18/bin/pg_dump" -U postgres -d gestor_proyectos -f gestor_proyectos_backup.sql


6. Importar
Inicialmente posicionarse en la carpeta database del proyecto y allí indicar en la terminal:

"/c/Program Files/PostgreSQL/18/bin/pg_restore"  -U postgres -d gestor_proyectos gestor_proyectos_backup.sql


7. Verificar funcionamiento
Para comprobar que todo funciona:
Abrir la base gestor_proyectos
Abrir: Schemas -> public -> Tables
Si aparecen las tablas correctamente, la importación fue exitosa.
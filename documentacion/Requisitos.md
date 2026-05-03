Requisitos funcionales:

* El sistema debe permitir a los usuarios crearse un perfil con un email y contraseña válidos.
* El sistema debe permitir a los usuarios iniciar sesión con su email y contraseña correspondiente.
* El sistema debe permitir a los usuarios mostrar las tareas asignadas.
* El sistema debe permitir a los usuarios filtrar las tareas por prioridad.
* El sistema debe permitir a los usuarios realizar una estimación de tiempo de cada tarea.
* El sistema debe permitir a los usuarios cambiar el estado de una tarea.
* El sistema debe permitir diferenciar roles (administrador, colaborador).
* El sistema debe permitir a los usuarios administradores acceder al panel administración.
* El sistema debe permitir a los usuarios administradores crear un nuevo proyecto.
* El sistema debe permitir editar la información de un proyecto.
* El sistema debe permitir a los usuario administradores subir un archivo .csv y crear las tareas a partir del mismo.
* El sistema debe permitir a los usuarios administradores asignar tareas del proyecto a colaboradores.
* El sistema debe permitir registrar la fecha de creación de un proyecto y la fecha de asignación de una tarea.
* El sistema debe permitir editar tareas.
* El sistema debe permitir generar un informe de progreso del proyecto.


Requisitos no funcionales:

* El sistema debe responder a las solicitudes en menos de 2 segundos en condiciones normales.
* Las contraseñas de los usuarios deben estar encriptadas.
* El usuario debe poder registrarse en menos de 5 clics.
* La arquitectura debe permitir agregar nuevas funcionalidades sin afectar las existentes.
* La aplicación debe soportar hasta 50 usuarios concurrentes sin degradar la experiencia.
* La aplicación debe ser responsive, siendo compatible con computadoras, tablets y celulares.
* El sistema debe tener tests automatizados.
* No deben existir tareas sin proyecto asociado.
* No deben existir tareas asignadas a usuarios inexistentes.

export class CreateTareaDto {
    titulo!: string;
    descripcion!: string;
    idProyecto!: number;
    idEstado!: number;
    idPrioridad!: number;
    idUsuario?: number | undefined;
    estimacion?: number | undefined;
}
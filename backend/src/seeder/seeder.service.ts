import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Estado } from "src/estados/entities/estado.entity";
import { ESTADOS } from "src/estados/RegistroEstados";
import { Prioridad } from "src/prioridad/entities/prioridad.entity";
import { ObjectLiteral, QueryDeepPartialEntity, Repository } from "typeorm";

@Injectable()
export class SeederService implements OnApplicationBootstrap {

    constructor(
        @InjectRepository(Estado)
        private readonly estadoRepo: Repository<Estado>,
        @InjectRepository(Prioridad)
        private readonly prioridadRepo: Repository<Prioridad>
    ) { }

    async onApplicationBootstrap() {
        await this.seedEstados();
        await this.seedPrioridades();
    }

    private async seed<T extends ObjectLiteral>(repo: Repository<T>, values: QueryDeepPartialEntity<T>[]): Promise<void> {

        if (values.length === 0) return;
        await repo
            .createQueryBuilder()
            .insert()
            .values(values)
            .orIgnore()
            .execute();
    }

    async seedEstados() {
        await this.seed(this.estadoRepo, ESTADOS.map(estado => ({ codigo: estado.codigo, nombre: estado.nombre })));
    }

    async seedPrioridades() {
        const nombres = ['Baja', 'Media', 'Alta'];
        await this.seed(this.prioridadRepo, nombres.map(nombre => ({ nombre })));
    }
}
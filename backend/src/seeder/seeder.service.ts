import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Estado } from "src/estados/entities/estado.entity";
import { Prioridad } from "src/prioridad/entities/prioridad.entity";
import { ObjectLiteral, Repository } from "typeorm";

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

    private async seed<T extends ObjectLiteral>(repo: Repository<T>, values: { nombre: string }[]): Promise<void> {

        if (values.length === 0) return;
        await repo
            .createQueryBuilder()
            .insert()
            .values(values as any)
            .orIgnore()
            .execute();
    }

    async seedPrioridades() {
        const nombres = ['Asignada', 'En progreso', 'Finalizada'];
        await this.seed(this.estadoRepo, nombres.map(nombre => ({ nombre })));
    }

    async seedEstados() {
        const nombres = ['Baja', 'Media', 'Alta'];
        await this.seed(this.prioridadRepo, nombres.map(nombre => ({ nombre })));
    }
}
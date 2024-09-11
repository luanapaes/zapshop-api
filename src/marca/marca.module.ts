import { forwardRef, Module } from "@nestjs/common";
import { MarcaService } from "./marca.service";
import { MarcaController } from "./marca.controller";
import { CategoriaModule } from "src/categoria/categoria.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MarcaEntity } from "./entity/marca.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([MarcaEntity]), // Registra o repositório MarcaEntity
        forwardRef(() => CategoriaModule),
    ],
    controllers: [MarcaController],
    providers: [MarcaService],
    exports: [MarcaService]
})
export class MarcaModule {}
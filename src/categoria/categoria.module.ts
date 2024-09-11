import { forwardRef, Module } from "@nestjs/common";
import { CategoriaController } from "./categoria.controller";
import { CategoriaService } from "./categoria.service";
import { MarcaModule } from "src/marca/marca.module";

@Module({
    imports: [
        forwardRef(() => MarcaModule)
    ],
    controllers: [CategoriaController],
    providers: [CategoriaService],
    exports: []
})
export class CategoriaModule {}
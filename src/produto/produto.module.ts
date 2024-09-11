import { forwardRef, Module } from "@nestjs/common";
import { CategoriaModule } from "src/categoria/categoria.module";
import { ProdutoController } from "./produto.controller";
import { ProdutoService } from "./produto.service";
import { MarcaModule } from "src/marca/marca.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProdutoEntity } from "./entity/produto.entity";
import { MarcaEntity } from "src/marca/entity/marca.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProdutoEntity, MarcaEntity]),
        forwardRef(() => CategoriaModule),
        MarcaModule, // Importa o MarcaModule
    ],
    controllers: [ProdutoController],
    providers: [ProdutoService],
    exports: [ProdutoService]
})
export class ProdutoModule {

}
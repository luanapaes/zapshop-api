import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { CategoriaModule } from "src/categoria/categoria.module";
import { ProdutoController } from "./produto.controller";
import { ProdutoService } from "./produto.service";
import { MarcaModule } from "src/marca/marca.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProdutoEntity } from "./entity/produto.entity";
import { MarcaEntity } from "src/marca/entity/marca.entity";
import { ProdutoIdCheckMiddleware } from "src/middlewares/produto-id-check.middleware";
import { AuthModule } from "src/auth/auth.module";
import { UsuarioModule } from "src/usuario/usuario.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProdutoEntity, MarcaEntity]),
        forwardRef(() => CategoriaModule),
        MarcaModule, AuthModule, UsuarioModule
    ],
    controllers: [ProdutoController],
    providers: [ProdutoService],
    exports: [ProdutoService]
})
export class ProdutoModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProdutoIdCheckMiddleware).forRoutes({
            path: 'produtos/:id',
            method: RequestMethod.ALL
        })
    }
}
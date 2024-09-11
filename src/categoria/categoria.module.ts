import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { CategoriaController } from "./categoria.controller";
import { CategoriaService } from "./categoria.service";
import { MarcaModule } from "src/marca/marca.module";
import { CategoriaIdCheckMiddleware } from "src/middlewares/categoria-id-check.middlware";
import { AuthModule } from "src/auth/auth.module";
import { UsuarioModule } from "src/usuario/usuario.module";

@Module({
    imports: [
        forwardRef(() => MarcaModule),
        AuthModule, UsuarioModule
    ],
    controllers: [CategoriaController],
    providers: [CategoriaService],
    exports: []
})
export class CategoriaModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CategoriaIdCheckMiddleware).forRoutes({
            path: 'categorias/:id',
            method: RequestMethod.ALL
        })
    }
}
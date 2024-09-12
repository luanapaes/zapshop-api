import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MarcaService } from "./marca.service";
import { MarcaController } from "./marca.controller";
import { CategoriaModule } from "src/categoria/categoria.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MarcaEntity } from "./entity/marca.entity";
import { MarcaIdCheckMiddleware } from "src/middlewares/marca-id-check.middlware";
import { AuthModule } from "src/auth/auth.module";
import { UsuarioModule } from "src/usuario/usuario.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([MarcaEntity]),
        forwardRef(() => CategoriaModule),
        AuthModule, UsuarioModule
    ],
    controllers: [MarcaController],
    providers: [MarcaService],
    exports: [MarcaService]
})
export class MarcaModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(MarcaIdCheckMiddleware).forRoutes({
            path: 'marcas/:id',
            method: RequestMethod.ALL
        })
    }
}
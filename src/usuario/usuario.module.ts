import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuarioEntity } from "./entity/usuario.entity";
import { UsuarioIdCheckMiddleware } from "src/middlewares/usuario-id-check.middlware";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([UsuarioEntity]),
        AuthModule
    ],
    controllers: [UsuarioController],
    providers: [UsuarioService, UsuarioEntity],
    exports: [UsuarioService]
})
export class UsuarioModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UsuarioIdCheckMiddleware).forRoutes({
            path: 'usuarios/:id',
            method: RequestMethod.ALL
        })
    }
}
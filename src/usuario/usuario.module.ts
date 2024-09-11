import { Module } from "@nestjs/common";
import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuarioEntity } from "./entity/usuario.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UsuarioEntity]),
    ],
    controllers: [UsuarioController],
    providers: [UsuarioService, UsuarioEntity],
    exports: [UsuarioService]
})
export class UsuarioModule {}
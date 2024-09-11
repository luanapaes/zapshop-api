import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuarioEntity } from "src/usuario/entity/usuario.entity";
import { UsuarioModule } from "src/usuario/usuario.module";
import { UsuarioService } from "src/usuario/usuario.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";


@Module({
    imports: [
        JwtModule.register({
            secret: String(process.env.JWT_SECRET)
        }),
        forwardRef(() => UsuarioModule),
        TypeOrmModule.forFeature([UsuarioEntity])
    ],
    controllers: [AuthController],
    providers: [AuthService, UsuarioService],
    exports: [AuthService]
})
export class AuthModule {}
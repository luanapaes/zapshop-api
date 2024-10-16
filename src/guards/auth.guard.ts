import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { console } from "inspector";
import { AuthService } from "src/auth/auth.service";
import { UsuarioService } from "src/usuario/usuario.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly usuarioService: UsuarioService
    ) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;

        try {
            const token = (authorization ?? '').split(' ')[1];
            const payload = this.authService.checkToken(token);

            console.log("Token Payload:", payload); // exibe payload

            request.user = payload;

            request.userDetails = await this.usuarioService.listOne(payload.id);

            return true;
        } catch (e) {
            console.error("Error in AuthGuard:", e);
            return false;
        }

    }

    //valida o token pelo guard, abre os dados do token, pega os dados do PayLoad
    //e coloca no request numa variável que não existia ainda - request.token - no request
}
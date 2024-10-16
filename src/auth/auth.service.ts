import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UsuarioEntity } from "src/usuario/entity/usuario.entity";
import { UsuarioService } from "src/usuario/usuario.service";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { AuthRegisterDTO } from "./dto/auth-register.dto";

@Injectable()
export class AuthService {
    private audience = "audience";
    private issuer = "issuer";

    constructor(
        private readonly jwtService: JwtService,
        private readonly usuarioService: UsuarioService,

        @InjectRepository(UsuarioEntity)
        private usuariosRepository: Repository<UsuarioEntity>
    ) { }

    createToken(user) {
        return {
            accessToken: this.jwtService.sign({
                id: user.id,
                name: user.username,
                email: user.email
            }, {
                secret: process.env.JWT_SECRET,
                expiresIn: "7 days",
                subject: String(user.id),
                issuer: this.issuer,
                audience: this.audience
            })
        }
    }

    checkToken(token: string) {

        try {
            const data = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
                issuer: this.issuer,
                audience: this.audience
            });
            return data
        } catch (e) {
            throw new BadRequestException(e.message);
        }

    }

    isValidToken(token: string) {
        try {
            this.checkToken(token);
            return true;
        } catch (e) {
            return false;
        }
    }

    async login(email: string, password: string) {

        const user = await this.usuariosRepository.findOneBy({
            email
        })

        if (!user) {
            throw new UnauthorizedException("Email ou senha incorretos.");
        }

        if (! await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException("Email ou senha incorretos.");
        }

        return this.createToken(user);
    }

    async forget(email: string) {
        const user = await this.usuariosRepository.findOneBy({
            email
        })

        if (!user) {
            throw new UnauthorizedException("E-mail incorreto.")
        }

        this.jwtService.sign({
            id: user.id
        }, {
            secret: process.env.JWT_SECRET,
            expiresIn: "30 minutes",
            subject: String(user.id),
            issuer: 'forget',
            audience: 'users'
        })

        return true;
    }

    async reset(password: string, token: string) {
        try {
            const data: any = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
                issuer: 'forget',
                audience: 'users',
            })

            if (isNaN(Number(data.id))) {
                throw new BadRequestException("Token não é válido")
            }

            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt)

            await this.usuariosRepository.update(Number(data.id), {
                password
            });

            const user = await this.usuarioService.listOne(data.id);

            return this.createToken(user)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    async register(data: AuthRegisterDTO) {

        const user = await this.usuarioService.create(data);

        // return this.createToken(user)
        const token = this.createToken(user);
        return {
            token: token,
            user: user.map((user) => user.id)
        };
    }
}
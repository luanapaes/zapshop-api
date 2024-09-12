import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"
import { UsuarioEntity } from "./entity/usuario.entity";
import { Repository } from "typeorm";
import { CreateUsuarioDTO } from "./dto/create-usuario.dto";
import * as bcrypt from "bcrypt"
import { UpdatePutUsuario } from "./dto/update-put-usuario.dto";
import { UpdatePatchUsuario } from "./dto/update-patch-usuario.dto";

@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private usuariosRepository: Repository<UsuarioEntity>
    ){}

    async exists(id: number) {

        if (!(await this.usuariosRepository.exists({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`Usuário ${id} não encontrado.`)
        }
    }

    async create(data: CreateUsuarioDTO){
        //verifica se o usuário já existe
        if (await this.usuariosRepository.exists({
            where: {
                email: data.email
            }
        })) {
            throw new BadRequestException("Este e-mail já está cadastrado.");
        }
        
        //faz criptografia da senha
        const salt = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, salt);

        //cria e salva usuário
        const user = this.usuariosRepository.create(data);
        return this.usuariosRepository.save([user]); 
    }

    async list() {
        return this.usuariosRepository.find();
    }

    async getUserByIdUsingRelations(userId: number): Promise<UsuarioEntity> {
        return this.usuariosRepository.findOne({
            where: {
                id: userId
            },
            relations: ['marcas']
        })
    }

    async listOne(id: number) {
        await this.exists(id);

        return this.usuariosRepository.findOneBy({
            id
        })
    }

    async update(id: number, { nome, nome_empresa, email, password }: UpdatePutUsuario) {

        await this.exists(id)

        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);

        await this.usuariosRepository.update(id, {
            nome,
            nome_empresa,
            email,
            password
        });

        return this.listOne(id);
    }

    async updatePartial(id: number, { nome, nome_empresa, email, password }: UpdatePatchUsuario) {

        await this.exists(id)

        const data: any = {};

        if (nome) {
            data.name = nome;
        }

        if(nome_empresa){
            data.nome_empresa = nome_empresa;
        }

        if (email) {
            data.email = email;
        }

        if (password) {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(password, salt);
        }

        await this.usuariosRepository.update(id, data);
        return this.listOne(id)
    }

    async delete(id: number) {

        await this.exists(id)

        return this.usuariosRepository.delete(id);
    }


}
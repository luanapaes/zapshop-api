import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MarcaEntity } from "./entity/marca.entity";
import { Repository } from "typeorm";
import { CreateMarcaDTO } from "./dto/create-marca.dto";

Injectable()
export class MarcaService {
    constructor(
        @InjectRepository(MarcaEntity)
        private marcasRepository: Repository<MarcaEntity>
    ) { }

    async exists(id: number) {

        if (!(await this.marcasRepository.exists({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`Marca não encontrada.`)
        }
    }

    async existsByName(marca_name: string) {

        if (!(await this.marcasRepository.exists({
            where: {
                nome_marca: marca_name
            }
        }))) {
            throw new NotFoundException(`Marca não encontrada.`)
        }
    }

    async create(data: CreateMarcaDTO){
        console.log(data.usuarioId)
        if (!(await this.marcasRepository.exists({
            where: {
                nome_marca: data.nome_marca
            }
        }))){
            const newMarca: CreateMarcaDTO = {
                usuarioId: data.usuarioId,
                nome_marca: data.nome_marca,
                categorias: data.categorias,
                logomarca: data.logomarca
            }

            const marca = this.marcasRepository.create(newMarca);

            return await this.marcasRepository.save(marca);
        } else{
            throw new NotFoundException(`A marca ${data.nome_marca} já está cadastrada.`)
        }
    }

    async findMarcaById(id: number) {
        await this.exists(id)

        return this.marcasRepository.findOneBy({
            id
        })

    }

    async findMarcaByName(name: string){
        return this.marcasRepository.findOneBy({
            nome_marca: name
        })

    }

    async delete(id: number) {

        await this.exists(id);

        //verifica se o todo existe
        const todo = await this.marcasRepository.findOne({
            where: {
                id
            }
        });

        return await this.marcasRepository.remove(todo)

    }

}
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
        await this.existsByName(data.nome_marca);

        const newMarca: CreateMarcaDTO = {
            nome_marca: data.nome_marca,
            categorias: data.categorias,
            logomarca: data.logomarca,
            usuarioId: data.usuarioId
        }

        const marca = await this.marcasRepository.create(newMarca);
        return this.marcasRepository.save(marca);

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

}
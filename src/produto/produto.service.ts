import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProdutoEntity } from "./entity/produto.entity";
import { CreateProdutoDTO } from "./dto/create-produto.dto";
import { MarcaEntity } from "src/marca/entity/marca.entity";
import { MarcaService } from "src/marca/marca.service";

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(ProdutoEntity)
        private produtosRepository: Repository<ProdutoEntity>,

        @InjectRepository(MarcaEntity)
        private marcasRepository: Repository<MarcaEntity>,
        
        private readonly marcasService: MarcaService
    ) { }

    async create(data: CreateProdutoDTO) {
        const marca = await this.marcasService.findMarcaById(data.marcaId);

        if (await this.marcasRepository.exists({
            where: {
                nome_marca: marca.nome_marca
            }
        })) {
            throw new NotFoundException(`Marca ${marca.nome_marca} não encontrada.`);
        }

        const newProduto: CreateProdutoDTO = {
            nome_produto: data.nome_produto,
            produto_preco: data.produto_preco,
            produto_description: data.produto_description,
            produto_image: data.produto_image,
            marcaId: marca.id
        }

        const produto = await this.produtosRepository.create(newProduto);
        return this.produtosRepository.save(produto);
    }
}
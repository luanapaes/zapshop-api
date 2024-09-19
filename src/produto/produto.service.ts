import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProdutoEntity } from "./entity/produto.entity";
import { CreateProdutoDTO } from "./dto/create-produto.dto";
import { MarcaEntity } from "src/marca/entity/marca.entity";
import { MarcaService } from "src/marca/marca.service";
import { createClient } from "@supabase/supabase-js";
import { ProductImage } from "./types/product-image.type";
import { UpdatePutProdutoDTO } from "./dto/update-put-produto.dto";

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(ProdutoEntity)
        private produtosRepository: Repository<ProdutoEntity>,

        @InjectRepository(MarcaEntity)
        private marcasRepository: Repository<MarcaEntity>,

        private readonly marcasService: MarcaService
    ) { }

    supabaseURL = process.env.SUPABASE_URL;
    supabaseKEY = process.env.SUPABASE_KEY;

    async create(data: CreateProdutoDTO, file: ProductImage) {

        const fullMarca = await this.marcasService.findIdByNome(data.nome_marca)

        if (await this.marcasRepository.exists({
            where: {
                nome_marca: data.nome_marca
            }
        })) {
            const supabase = createClient(this.supabaseURL, this.supabaseKEY, {
                auth: {
                    persistSession: false
                }
            });

            const newLogomarca = await supabase.storage
                .from('product_image')
                .upload(file.originalname, file.buffer, {
                    upsert: true,
                });

            if (newLogomarca.error) {
                throw new Error(newLogomarca.error.message);
            }

            // faz uma url para a logomarca
            const { data: publicData } = supabase.storage
                .from('product_image')
                .getPublicUrl(newLogomarca.data.path);

            if (!data) {
                throw new Error('Erro ao gerar URL pública: ');
            }

            if (!publicData.publicUrl) {
                throw new Error('Não foi possível gerar a URL pública.');
            }

            const newProduto: CreateProdutoDTO = {
                nome_produto: data.nome_produto,
                produto_preco: data.produto_preco,
                produto_descricao: data.produto_descricao,
                categorias: fullMarca.categorias,
                produto_image: publicData.publicUrl,
                marcaId: fullMarca.id
            }

            const produto = this.produtosRepository.create(newProduto);
            return await this.produtosRepository.save(produto);
        } {
            throw new NotFoundException(`Marca ${data.nome_marca} não encontrada.`);
        }
    }

    async exists(id: number) {

        if (!(await this.produtosRepository.exists({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`Marca não encontrada.`)
        }
    }

    async read() {
        return this.marcasRepository.find();
    }

    async readOne(id: number) {
        await this.exists(id)

        return this.produtosRepository.findOneBy({
            id
        })
    }

    async update(id: number, { nome_produto, produto_descricao, produto_preco, produto_image, nome_marca }: UpdatePutProdutoDTO) {

        await this.exists(id)
        
        const fullMarca = await this.marcasService.findIdByNome(nome_marca)


        await this.produtosRepository.update(id, {
            nome_produto: nome_produto,
            produto_descricao: produto_descricao,
            produto_preco: produto_preco,
            produto_image: produto_image,
            marcaId: fullMarca.id
        });

        return this.readOne(id);
    }

    async updatePartial(id: number, { nome_produto, produto_descricao, produto_preco, produto_image }: UpdatePutProdutoDTO) {
        await this.exists(id)

        const data: any = {};

        if (nome_produto) {
            data.nome_produto = nome_produto
        }

        if (produto_descricao) {
            data.produo_descricao = produto_descricao
        }

        if (produto_preco) {
            data.produto_preco = produto_preco;
        }

        if (produto_image) {
            data.produto_image = produto_image;
        }

        await this.produtosRepository.update(id, data);
        return this.readOne(id)
    }
}

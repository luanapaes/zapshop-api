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
import { UpdatePatchProdutoDTO } from "./dto/upadate-patch-produto.dto";
import { v4 as uuidv4 } from 'uuid';

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

    supabase = createClient(this.supabaseURL, this.supabaseKEY, {
        auth: {
            persistSession: false
        }
    });

    async create(data: CreateProdutoDTO, file: ProductImage) {

        const fullMarca = await this.marcasService.findIdByNome(data.nome_marca)

        if (await this.marcasRepository.exists({
            where: {
                nome_marca: data.nome_marca
            }
        })) {

            const base64String = data.produto_imagem;

            // extrai e decodifica o conteúdo base64
            const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                throw new Error('Formato inválido de base64');
            }

            const mimeType = matches[1]; // tipo MIME - ex: image/jpeg
            const imageData = matches[2]; // conteúdo base64 da imagem

            const buffer = Buffer.from(imageData, 'base64'); // converte para buffer

            // faz upload para o Supabase
            const newLogomarca = await this.supabase.storage
                .from('product_image')
                .upload(data.nome_produto, buffer, {
                    contentType: mimeType,
                    upsert: true,
                });

            if (newLogomarca.error) {
                throw new Error(newLogomarca.error.message);
            }

            // faz uma url para a logomarca
            const { data: publicData } = this.supabase.storage
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
                categorias: data.categorias,
                produto_imagem: publicData.publicUrl,
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
            throw new NotFoundException(`Produto não encontrado.`)
        }
    }

    async read() {
        return this.produtosRepository.find();
    }

    async readOne(id: number) {
        await this.exists(id)

        return this.produtosRepository.findOneBy({
            id
        })
    }

    async update(id: number, { nome_produto, produto_descricao, produto_preco, produto_imagem, nome_marca }: UpdatePutProdutoDTO, productImage: ProductImage) {

        if (nome_produto != '' && produto_descricao != '' && produto_preco != null && produto_imagem != null && nome_marca != '') {
            await this.exists(id)

            const fullMarca = await this.marcasService.findIdByNome(nome_marca)

            const newLogomarca = await this.supabase.storage
                .from('product_image')
                .upload(productImage.originalname, productImage.buffer, {
                    upsert: true,
                });

            if (newLogomarca.error) {
                console.error("Erro no upload da imagem:", newLogomarca.error);
                throw new Error(newLogomarca.error.message);
            }

            // faz uma url para a logomarca
            const { data: publicData } = this.supabase.storage
                .from('product_image')
                .getPublicUrl(newLogomarca.data.path);

            if (!publicData || !publicData.publicUrl) {
                throw new Error('Não foi possível gerar a URL pública.');
            }


            await this.produtosRepository.update(id, {
                nome_produto: nome_produto,
                produto_descricao: produto_descricao,
                produto_preco: produto_preco,
                produto_imagem: publicData.publicUrl,
                marcaId: fullMarca.id
            });

            return this.readOne(id);
        } {
            throw new NotFoundException("É necessário preencher todos os campos.");
        }
    }


    async updatePartial(
        id: number,
        produto: UpdatePatchProdutoDTO
    ) {
        if (
            produto.nome_produto !== undefined ||
            produto.produto_descricao !== undefined ||
            produto.produto_preco !== undefined ||
            produto.produto_imagem !== undefined ||
            produto.nome_marca !== undefined
        ) {
            // Verifica se o produto existe
            await this.exists(id);

            const fullMarca = await this.marcasService.findIdByNome(produto.nome_marca)

            const data: any = {};

            if (produto.nome_produto) {
                data.nome_produto = produto.nome_produto;
            }

            if (produto.produto_descricao) {
                data.produto_descricao = produto.produto_descricao;
            }

            if (produto.produto_preco !== undefined) {
                data.produto_preco = produto.produto_preco;
            }

            if (produto.produto_imagem) {

                // verifica se a imagem está em formato base64 válido
                if (produto.produto_imagem.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)) {
                    const base64String = produto.produto_imagem;
                    const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

                    if (!matches || matches.length !== 3) {
                        throw new Error('Formato inválido de base64');
                    }

                    const mimeType = matches[1]; // Tipo MIME (ex: image/jpeg)
                    const imageData = matches[2]; // Dados base64 da imagem
                    const buffer = Buffer.from(imageData, 'base64');

                    // gera um nome único para o arquivo
                    const fileName = produto.nome_produto
                        ? `${produto.nome_produto.replace(/\s+/g, '_')}_${Date.now()}`
                        : `image_${uuidv4()}`;

                    // faz upload para o Supabase
                    const updateImage = await this.supabase.storage
                        .from('product_image')
                        .upload(fileName, buffer, {
                            contentType: mimeType,
                            upsert: true,
                        });

                    if (updateImage.error) {
                        throw new Error(updateImage.error.message);
                    }

                    // gera uma URL pública para a imagem no Supabase
                    const { data: publicData } = this.supabase.storage
                        .from('product_image')
                        .getPublicUrl(updateImage.data.path);

                    data.produto_imagem = publicData.publicUrl;
                } else {
                    throw new Error('A imagem enviada não está em formato base64 válido.');
                }
            }

            // Atualiza o ID da marca, se fornecido
            if (fullMarca && fullMarca.nome_marca) {
                data.marcaId = fullMarca.id;
            }

            // Depuração: exibe os dados a serem atualizados
            console.log('Dados a serem atualizados:', data);

            // Realiza a atualização no repositório
            await this.produtosRepository.update(id, data);

            // Retorna o produto atualizado
            return this.readOne(id);
        } else {
            // Nenhum campo válido foi fornecido para atualização
            throw new NotFoundException('Nenhuma informação alterada.');
        }
    }


    // função para apagar do supabase - deve receber o caminho da imagem
    async deleteImageFromSupabase(imagePath: string): Promise<void> {
        const { error } = await this.supabase.storage
            .from('product_image')
            .remove([imagePath]);

        if (error) {
            throw new Error(`Erro ao deletar a imagem: ${error.message}`);
        }
    }

    async delete(id: number): Promise<void> {
        const produto = await this.readOne(id);

        if (produto.produto_imagem) {
            // busca o caminho da imagem
            const imagePath = produto.produto_imagem.split('/').pop();
            // apaga do supabase
            await this.deleteImageFromSupabase(imagePath);
            // apaga do banco
            await this.produtosRepository.delete(id);
        }
        else {
            console.log("erro")
        }
    }

}

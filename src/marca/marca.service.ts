import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MarcaEntity } from "./entity/marca.entity";
import { Repository } from "typeorm";
import { CreateMarcaDTO } from "./dto/create-marca.dto";
import { LogomarcaDTO } from "./dto/logomarca.dto";
import { createClient } from "@supabase/supabase-js";
import { UpdatePutMarcaDTO } from "./dto/update-put-marca.dto";
import { UpdatePatchMarcaDTO } from "./dto/update-patch-marca.dto";
import { ProductImage } from "src/produto/types/product-image.type";
import { v4 as uuidv4 } from 'uuid';

Injectable()
export class MarcaService {
    constructor(
        @InjectRepository(MarcaEntity)
        private marcasRepository: Repository<MarcaEntity>
    ) { }

    supabaseURL = process.env.SUPABASE_URL;
    supabaseKEY = process.env.SUPABASE_KEY;

    supabase = createClient(this.supabaseURL, this.supabaseKEY, {
        auth: {
            persistSession: false
        }
    });

    async exists(id: number) {

        if (!(await this.marcasRepository.exists({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`Marca não encontrada.`)
        }
    }


    async create(data: CreateMarcaDTO, file: LogomarcaDTO) {
        // verifica se a marca já existe no banco de dados
        if (!(await this.marcasRepository.exists({
            where: {
                nome_marca: data.nome_marca,
                usuarioId: data.usuarioId
            }
        }))) {

            const base64String = data.logomarca;

            // extrai e decodifica o conteúdo base64
            const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                throw new Error('Formato inválido de base64');
            }

            const mimeType = matches[1]; // tipo MIME - ex: image/jpeg
            const imageData = matches[2]; // conteúdo base64 da imagem

            const buffer = Buffer.from(imageData, 'base64'); // converte para buffer

            // faz o upload da imagem para o bucket 'logomarca'
            const newLogomarca = await this.supabase.storage
                .from('logomarca')  // Certifique-se de que o nome do bucket está correto aqui
                .upload(data.nome_marca, buffer, {
                    contentType: mimeType,
                    upsert: true,
                });

            // verifica se houve algum erro durante o upload
            if (newLogomarca.error) {
                throw new Error(newLogomarca.error.message);
            }

            // gera a URL pública da imagem usando o bucket'logomarca'
            const { data: publicData } = this.supabase.storage
                .from('logomarca') 
                .getPublicUrl(newLogomarca.data.path);

            if (!publicData?.publicUrl) {
                throw new Error('Não foi possível gerar a URL pública.');
            }

            // cria o objeto da marca
            const newMarca: CreateMarcaDTO = {
                usuarioId: data.usuarioId,
                nome_marca: data.nome_marca,
                categorias: data.categorias,
                logomarca: publicData.publicUrl,
            }

            // salva a nova marca no banco de dados
            const marca = this.marcasRepository.create(newMarca);

            return await this.marcasRepository.save(marca);
        } else {
            throw new NotFoundException(`A marca ${data.nome_marca} já está cadastrada.`)
        }
    }

    async read(){
        return this.marcasRepository.find();
    }

    async findMarcaById(id: number): Promise<MarcaEntity> {
        await this.exists(id)

        return this.marcasRepository.findOneBy({
            id
        })

    }

    async findIdByNome(nome: string){

        const marca = await this.marcasRepository.findOneBy({ nome_marca: nome });

        if (marca) {
            return marca;
        } else {
            throw new BadRequestException(`Marca com nome ${nome} não encontrada`);
        }

    }

    async findByNome(nome: string) {
        const marca = await this.marcasRepository
            .createQueryBuilder('marca')
            .where('marca.nome_marca = :nome', { nome })
            .getOne();

        if (marca) {
            return this.marcasRepository.findOne({
                where: {
                    nome_marca: nome
                },
                relations: ['produtos']
            })
            // return marca;
        } else {
            return this.read()
        }
    }


    async update(id: number, { nome_marca, categorias, logomarca }: UpdatePutMarcaDTO, marcaImage: ProductImage) {

        if (nome_marca != '' && categorias != '' && logomarca != '') {
            await this.exists(id)


            const newLogomarca = await this.supabase.storage
                .from('logomarca')
                .upload(marcaImage.originalname, marcaImage.buffer, {
                    upsert: true,
                });

            if (newLogomarca.error) {
                console.error("Erro no upload da imagem:", newLogomarca.error);
                throw new Error(newLogomarca.error.message);
            }

            // faz uma url para a logomarca
            const { data: publicData } = this.supabase.storage
                .from('logomarca')
                .getPublicUrl(newLogomarca.data.path);

            if (!publicData || !publicData.publicUrl) {
                throw new Error('Não foi possível gerar a URL pública.');
            }


            await this.marcasRepository.update(id, {
                nome_marca: nome_marca,
                categorias: categorias,
                logomarca: publicData.publicUrl,
            });

            return this.findMarcaById(id);
        } {
            throw new NotFoundException("É necessário preencher todos os campos.");
        }
    }

    async updatePartial(id: number, marca: UpdatePatchMarcaDTO) {
        
        if (marca.nome_marca != undefined || marca.categorias != undefined || marca.logomarca != undefined){
            await this.exists(id)

            const data: any = {};

            if (marca.usuarioId) {
                data.usuarioId = marca.usuarioId
            }

            if (marca.nome_marca) {

                data.nome_marca = marca.nome_marca
            }

            if (marca.categorias) {
                data.categorias = marca.categorias;
            }

            if (marca.logomarca) {
                const base64String = marca.logomarca;

                const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                if (!matches || matches.length !== 3) {
                    throw new Error('Formato inválido de base64');
                }

                const mimeType = matches[1]; 
                const imageData = matches[2];

                const buffer = Buffer.from(imageData, 'base64');
                const fileName = marca.nome_marca ? `${marca.nome_marca.replace(/\s+/g, '_')}_${Date.now()}`
                : `logomarca_${uuidv4()}`

                const newLogomarca = await this.supabase.storage
                    .from('logomarca')
                    .upload(fileName, buffer, {
                        contentType: mimeType,
                        upsert: true,
                    });
                    console.log("chegou aqui")

                if (newLogomarca.error) {
                    throw new Error(newLogomarca.error.message);
                }

                const { data: publicData } = this.supabase.storage
                    .from('logomarca')
                    .getPublicUrl(newLogomarca.data.path);

                    console.log(publicData.publicUrl)

                if (!publicData?.publicUrl) {
                    throw new Error('Não foi possível gerar a URL pública.');
                }
                
                data.logomarca = publicData.publicUrl;
            }

            await this.marcasRepository.update(id, data);
            return this.findMarcaById(id)
        } else {
            throw new NotFoundException("Nenhuma informação alterada.");
        } 
        
    }

    async delete(id: number) {

        await this.exists(id);

        //verifica se a marca existe
        const marca = await this.marcasRepository.findOne({
            where: {
                id
            }
        });

        return await this.marcasRepository.remove(marca)

    }

    async getMarcaByIdUsingRelations(marcaId: number): Promise<MarcaEntity> {
        return this.marcasRepository.findOne({
            where: {
                id: marcaId
            },
            relations: ['produtos']
        })
    }

}
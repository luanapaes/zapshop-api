import { IsNumber, IsString } from "class-validator";

export class CreateProdutoDTO {

    @IsString()
    nome_produto: string;

    @IsString()
    produto_image: string;

    @IsString()
    produto_preco: string;

    @IsString()
    produto_descricao: string;

    @IsString()
    categorias: string;

    @IsNumber()
    marcaId: number;

    @IsString()
    nome_marca?: string;
}
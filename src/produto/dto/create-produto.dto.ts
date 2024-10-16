import { IsNumber, IsString } from "class-validator";

export class CreateProdutoDTO {

    @IsString()
    nome_produto: string;

    @IsString()
    produto_imagem: string;

    @IsNumber()
    produto_preco: number;

    @IsString()
    produto_descricao: string;

    @IsString()
    categorias: string;

    @IsNumber()
    marcaId: number;

    @IsString()
    nome_marca?: string;
}
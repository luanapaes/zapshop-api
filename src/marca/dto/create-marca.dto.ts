import { IsString, IsNumber } from "class-validator";

export class CreateMarcaDTO {
    @IsNumber()
    usuarioId?: number;

    @IsString()
    nome_marca: string;

    @IsString()
    categorias: string;

    @IsString()
    logomarca: string;
}
import { Controller, Post, Request } from "@nestjs/common";
import { MarcaService } from "./marca.service";
import { CreateMarcaDTO } from "./dto/create-marca.dto";

@Controller('marcas')
export class MarcaController {
    constructor(
        private readonly marcasService: MarcaService
    ){}

    @Post()
    async create(marca: CreateMarcaDTO, @Request() req){

        marca.usuarioId = req.usuario.id
        return this.marcasService.create(marca)
    }
}
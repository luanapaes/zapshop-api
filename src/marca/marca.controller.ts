import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { MarcaService } from "./marca.service";
import { CreateMarcaDTO } from "./dto/create-marca.dto";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard)
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
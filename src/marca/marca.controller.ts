import { Body, Controller, Delete, Post, Request, UseGuards } from "@nestjs/common";
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
    async create(@Body() marca: CreateMarcaDTO, @Request() req){
        
        marca.usuarioId = req.user.id;
        return await this.marcasService.create(marca);
    }

    @Delete(':id')
    async delete(id: number){
        return this.marcasService.delete(id)
    }
}
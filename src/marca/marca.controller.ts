import { Body, Controller, Delete, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { MarcaService } from "./marca.service";
import { CreateMarcaDTO } from "./dto/create-marca.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@UseGuards(AuthGuard)
@Controller('marcas')
export class MarcaController {
    constructor(
        private readonly marcasService: MarcaService
    ){}

    @Post()
    @UseInterceptors(FileInterceptor('logomarca'))
    async create(@Body() marca: CreateMarcaDTO, @UploadedFile() logomarca, @Request() req){
        
        marca.usuarioId = req.user.id;
        return await this.marcasService.create(marca, logomarca);
    }

    @Delete(':id')
    async delete(id: number){
        return this.marcasService.delete(id)
    }
}
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { MarcaService } from "./marca.service";
import { CreateMarcaDTO } from "./dto/create-marca.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdatePutMarcaDTO } from "./dto/update-put-marca.dto";
import { UpdatePatchMarcaDTO } from "./dto/update-patch-marca.dto";

@UseGuards(AuthGuard)
@Controller('marcas')
export class MarcaController {
    constructor(
        private readonly marcasService: MarcaService
    ){}

    @Get()
    async read(){
        return this.marcasService.read()
    }

    // @Get(':id')
    // async listOne(@Param('id') id: number){
    //     return this.marcasService.findMarcaById(id);
    // }

    @Get(':id')
    async listOne(@Param('id') id: number) {
        return this.marcasService.getMarcaByIdUsingRelations(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('logomarca'))
    async create(@Body() marca: CreateMarcaDTO, @UploadedFile() logomarca, @Request() req){
        
        marca.usuarioId = req.user.id;
        return await this.marcasService.create(marca, logomarca);
    }

    @Put(':id')
    async update(@Body() marca: UpdatePutMarcaDTO, @Param("id") id: number, @Req() req) {
        
        marca.usuarioId = req.user.id;
        return this.marcasService.update(id, marca);

    }

    @Patch(':id')
    async updatePartial(@Body() marca: UpdatePatchMarcaDTO, @Param("id") id: number, @Req() req) {
        
        marca.usuarioId = req.user.id;
        return this.marcasService.updatePartial(id, marca);
        
    }

    @Delete(':id')
    async delete(id: number){
        return this.marcasService.delete(id)
    }
}
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { MarcaService } from "./marca.service";
import { CreateMarcaDTO } from "./dto/create-marca.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdatePutMarcaDTO } from "./dto/update-put-marca.dto";
import { UpdatePatchMarcaDTO } from "./dto/update-patch-marca.dto";


@Controller('marcas')
export class MarcaController {
    constructor(
        private readonly marcasService: MarcaService
    ){}

    // @Get()
    // async read(){
    //     return this.marcasService.read()
    // }

    // @Get(':id')
    // async listOne(@Param('id') id: number){
    //     return this.marcasService.findMarcaById(id);
    // }

    @Get(':id')
    async listByID(@Param('id') id: number) {
        return this.marcasService.getMarcaByIdUsingRelations(id);
    }

    @Get()
    async listOne(@Query('nome_marca') name: string) {
        return this.marcasService.findByNome(name);
    }

    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('logomarca'))
    async create(@Body() marca: CreateMarcaDTO, @UploadedFile() logomarca, @Request() req){
        
        marca.usuarioId = req.user.id;
        return await this.marcasService.create(marca, logomarca);
    }
    
    @UseGuards(AuthGuard)
    @Put(':id')
    @UseInterceptors(FileInterceptor('logomarca'))
    async update(@Body() marca: UpdatePutMarcaDTO, @UploadedFile() logomarca, @Param("id") id: number, @Req() req) {
        console.log(marca.nome_marca)
        marca.usuarioId = req.user.id;
        marca.logomarca = logomarca
        return this.marcasService.update(id, marca, logomarca);

    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async updatePartial(@Body() marca: UpdatePatchMarcaDTO, @Param("id") id: number, @Req() req) {
        
        marca.usuarioId = req.user.id;
        return this.marcasService.updatePartial(id, marca);
        
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(id: number){
        return this.marcasService.delete(id)
    }
}
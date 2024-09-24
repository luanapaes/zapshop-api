import { Body, Controller, Get, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProdutoService } from "./produto.service";
import { CreateProdutoDTO } from "./dto/create-produto.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdatePutProdutoDTO } from "./dto/update-put-produto.dto";

@UseGuards(AuthGuard)
@Controller('produtos')
export class ProdutoController {
    constructor(
        private readonly produtoService: ProdutoService
    ){}

    @Get()
    async read(){
        return this.produtoService.read();
    }

    @Get(':id')
    async readOne(id: number){
        return this.produtoService.readOne(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('produto_imagem'))
    async create(@Body() data: CreateProdutoDTO, @UploadedFile() productImage){
        return this.produtoService.create(data, productImage);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('produto_imagem'))
    async update(@Body() produto: UpdatePutProdutoDTO, @Param("id") id: number, @UploadedFile() productImage) {

        return this.produtoService.update(id, produto, productImage);

    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('produto_imagem'))
    async updatePartial(@Body() produto: UpdatePutProdutoDTO, @Param("id") id: number, @UploadedFile() productImage) {

        return this.produtoService.updatePartial(id, produto, productImage);

    }
}
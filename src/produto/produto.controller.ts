import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ProdutoService } from "./produto.service";
import { CreateProdutoDTO } from "./dto/create-produto.dto";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller('produtos')
export class ProdutoController {
    constructor(
        private readonly produtoService: ProdutoService
    ){}

    @Post()
    async cretae(@Body() data: CreateProdutoDTO){
        return this.produtoService.create(data);
    }
}
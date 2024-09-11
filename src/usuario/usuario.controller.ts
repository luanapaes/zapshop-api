import { Body, Controller, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { CreateUsuarioDTO } from "./dto/create-usuario.dto";
import { UsuarioService } from "./usuario.service";
import { UpdatePutUsuario } from "./dto/update-put-usuario.dto";
import { UpdatePatchUsuario } from "./dto/update-patch-usuario.dto";

@Controller('usuarios')
export class UsuarioController {

    constructor(
        private readonly usuarioService: UsuarioService
    ){}
    
    @Post()
    async createUsuario(@Body() data: CreateUsuarioDTO){
        return this.usuarioService.create(data);
    }

    @Get()
    async read(){
        return this.usuarioService.list();
    }

    @Put(':id')
    async update(@Body() data: UpdatePutUsuario, @Param("id") id: number){
        return this.usuarioService.update(id, data);
    }

    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUsuario, @Param("id") id: number){
        return this.usuarioService.updatePartial(id, data);
    }
}
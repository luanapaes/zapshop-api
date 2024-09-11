import { PartialType } from "@nestjs/mapped-types";
import { CreateUsuarioDTO } from "./create-usuario.dto";

export class UpdatePatchUsuario extends PartialType(CreateUsuarioDTO) {
    
}
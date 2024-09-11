import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard
)
@Controller('categorias')
export class CategoriaController {
    
}
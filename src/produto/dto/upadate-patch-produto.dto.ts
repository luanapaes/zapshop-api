import { PartialType } from '@nestjs/mapped-types'
import { CreateProdutoDTO } from './create-produto.dto';

export class UpdatePatchMarcaDTO extends PartialType(CreateProdutoDTO) {


}
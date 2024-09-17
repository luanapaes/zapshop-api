import { PartialType } from '@nestjs/mapped-types'
import { CreateMarcaDTO } from './create-marca.dto';

export class UpdatePatchMarcaDTO extends PartialType(CreateMarcaDTO) {


}
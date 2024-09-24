import { MarcaEntity } from "src/marca/entity/marca.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'categorias'
})
export class CategoriaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @ManyToOne(() => MarcaEntity, (marca) => marca.categoriasRelacionadas)
    marca: MarcaEntity;

}
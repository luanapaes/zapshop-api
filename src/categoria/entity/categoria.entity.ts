import { MarcaEntity } from "src/marca/entity/marca.entity";
import { ProdutoEntity } from "src/produto/entity/produto.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => ProdutoEntity, (produto) => produto.categoria)
    produtos: ProdutoEntity[];
}
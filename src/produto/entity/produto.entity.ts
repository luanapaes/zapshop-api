import { CategoriaEntity } from 'src/categoria/entity/categoria.entity';
import { MarcaEntity } from 'src/marca/entity/marca.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({
    name: 'produtos'
})
export class ProdutoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome_produto: string;

    @Column()
    produto_image: string;

    @Column()
    produto_preco: string;

    @Column()
    produto_descricao: string;

    @ManyToOne(() => MarcaEntity, (marca) => marca.produtos)
    marca: MarcaEntity;

    @ManyToOne(() => CategoriaEntity, (categoria) => categoria.produtos)
    categoria: CategoriaEntity;
}

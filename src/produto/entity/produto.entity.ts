import { MarcaEntity } from 'src/marca/entity/marca.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({
    name: 'produtos'
})
export class ProdutoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'marca_id',
        nullable: false
    })
    marcaId: number;

    @Column()
    nome_produto: string;

    @Column()
    produto_imagem: string;

    @Column()
    produto_preco: number;

    @Column()
    produto_descricao: string;

    @Column()
    categorias: string;

    @ManyToOne(() => MarcaEntity, (marca) => marca.produtos)
    @JoinColumn({
        name: 'marca_id',
        referencedColumnName: 'id'
    })
    marca: MarcaEntity;
}

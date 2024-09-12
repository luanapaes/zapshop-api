import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UsuarioEntity } from 'src/usuario/entity/usuario.entity';
import { CategoriaEntity } from 'src/categoria/entity/categoria.entity';
import { ProdutoEntity } from 'src/produto/entity/produto.entity';

@Entity({
    name: 'marcas'
})
export class MarcaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'usuario_id',
        nullable: false
    })
    usuarioId: number;

    @Column()
    nome_marca: string;

    @Column()
    categorias: string;

    @Column()
    logomarca: string;

    @ManyToOne(() => UsuarioEntity, (usuario) => usuario.marcas)
    @JoinColumn({
        name: 'usuario_id',
        referencedColumnName: 'id'
    })
    usuario?: UsuarioEntity;

    @OneToMany(() => CategoriaEntity, (categoria) => categoria.marca)
    categoriasRelacionadas: CategoriaEntity[];

    @OneToMany(() => ProdutoEntity, (produto) => produto.marca)
    produtos: ProdutoEntity[];

}

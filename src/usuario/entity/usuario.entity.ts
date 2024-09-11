import { MarcaEntity } from 'src/marca/entity/marca.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({
    name: 'usuarios'
})
export class UsuarioEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    nome_empresa: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => MarcaEntity, (marca) => marca.usuario)
    marcas: MarcaEntity[];
}

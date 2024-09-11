import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario/entity/usuario.entity';
import { MarcaEntity } from './marca/entity/marca.entity';
import { CategoriaEntity } from './categoria/entity/categoria.entity';
import { ProdutoEntity } from './produto/entity/produto.entity';
import { ProdutoModule } from './produto/produto.module';
import { MarcaModule } from './marca/marca.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UsuarioEntity, MarcaEntity, CategoriaEntity, ProdutoEntity],
      synchronize: process.env.ENV === "development",
    }),
    MarcaModule,
    UsuarioModule,
    AuthModule,
    ProdutoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

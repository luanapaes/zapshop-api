import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  app.enableCors({
    origin: 'http://localhost:4200', // Permitir apenas o front-end do Angular
    methods: 'GET, POST, PATCH, DELETE, OPTIONS, PUT',
    allowedHeaders: 'X-CSRF-TOKEN, X-Requested-With, Content-Type, Authorization', // Headers permitidos
    credentials: true, // Permite o envio de cookies, tokens, etc.
    exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'], // Headers que podem ser acessados pelo cliente
  });
}
bootstrap();



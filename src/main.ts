import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { setupSwagger } from './swagger';
import { CustomWsAdapter } from '@/shared/libs/ws-custom.adapter';

async function bootstrap() {
   const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174'] ,
     // credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
  });
  app.useWebSocketAdapter(new CustomWsAdapter(app));

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // <<== BẮT BUỘC để @Type hoạt động
  }));
  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();

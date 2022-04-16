import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* エンドポイントを指定 */
  app.setGlobalPrefix('api/v1');

  /* cors設定 */
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  });

  app.useGlobalPipes(new ValidationPipe());

  /* PORT設定 */
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

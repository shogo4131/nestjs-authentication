import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* エンドポイントを指定 */
  app.setGlobalPrefix('api/v1');

  /* cors設定 */
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  });

  /* class-validationをグルーバルに使用する設定 */
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Authorizations API')
    .setDescription('NestJSを用いたAPI')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  fs.writeFileSync(
    './swagger/swagger-spec.json',
    JSON.stringify(document, undefined, 2),
  );

  /* PORT設定 */
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

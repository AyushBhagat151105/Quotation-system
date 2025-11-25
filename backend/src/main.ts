import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response } from 'express';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.APP_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  app.useStaticAssets(path.join(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('Quotation-Management API Documentation')
    .setDescription('This is the documentation for Quotation-Management API.')
    .setVersion('1.0')
    .addTag('Notes')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.getHttpAdapter().get('/openapi.json', (req, res: Response) => {
    res.json(document);
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT as string);

  logger.log(
    `Server is running on http://${process.env.LOCAL_IP}:${process.env.PORT}`,
  );
  logger.log(
    `Docs available at http://${process.env.LOCAL_IP}:${process.env.PORT}/docs`,
  );
  logger.log(
    `OpenAPI JSON at http://${process.env.LOCAL_IP}:${process.env.PORT}/openapi.json`,
  );
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Hotel Booking API')
    .setDescription('A hotel room booking system with CRUD operations for bookings, users, and resources.')
    .setVersion('1.0')
    .addTag('bookings', 'Booking management endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('resources', 'Resource (rooms) management endpoints')
    .addTag('history', 'Audit history and change tracking endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

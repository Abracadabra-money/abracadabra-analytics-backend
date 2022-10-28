import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { APP_PORT } from './env';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { DtoValidationPipe } from './validation/dto-validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableShutdownHooks();
    app.disable('x-powered-by');
    app.enableCors();

    app.useGlobalPipes(new DtoValidationPipe());
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder().setTitle('Abracadabra').setDescription('Abracadabra API description').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/doc', app, document);

    await app.listen(APP_PORT);
}
bootstrap();

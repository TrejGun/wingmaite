import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ns } from './common/constants';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle(ns)
        .setDescription('API description')
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);

    const host = configService.get<string>('HOST', 'localhost');
    const port = configService.get<number>('PORT', 3000);

    await app.listen(port, host, () => {
        console.info(`API server is running on http://${host}:${port}`);
    });
}

void bootstrap();

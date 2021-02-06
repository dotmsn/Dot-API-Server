/*
  Configure environment variables depending on whether
  the application is running in development or production mode.

  It is important to import "dotenv" before anything else to
  ensure that no required variables of undefined.
*/
import dotenv from 'dotenv';

dotenv.config({
    path: `./src/environments/${process.env.NODE_ENV}.env`,
});

// Libraries
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const port = process.env.PORT || 3000;

/*
  This is the main function of the project,
  here the application will be loaded using the main module "app.module.ts"
*/
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(port);

    Logger.log(
        `🚀 Server is listening on http://127.0.0.1:${port}`,
        'Bootstrap',
    );
}

bootstrap();

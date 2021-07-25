import { BadRequestException } from '@nestjs/common';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const validationPipeOptions = {
    forbidNonWhitelisted: true,
    exceptionFactory: (errors: ValidationError[]): any => {
        const error = errors[0];
        const constraintsName = Object.keys(error.constraints);
        const firstConstraint = error.constraints[constraintsName[0]];
        throw new BadRequestException("INVALID_" + error.property, firstConstraint);
    }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN || 'http://localhost:8080';
// import * as csurf from 'csurf';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ORIGIN,
    credentials: true,
  });
  // app.use(csurf({cookie: true }));

  await app.listen(PORT);
}
bootstrap();

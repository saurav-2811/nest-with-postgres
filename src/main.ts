import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{logger:[ 'log', 'error', 'warn', 'debug','verbose']});
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    allowedHeaders:"*",
    origin: "*"
});
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true,forbidUnknownValues: false }));
  await app.listen(PORT, () =>
    console.log(`Server is running at port ${PORT}`),
  );
}
bootstrap();

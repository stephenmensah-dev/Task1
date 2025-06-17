import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())

  try{
    await app.listen(process.env.PORT ?? 3000, ()=>{
      console.log('App is running \n')
    });
  }catch(error){
    console.error(error)
    throw new Error('Unable to connect to Postgres')
  }

  
}
bootstrap();

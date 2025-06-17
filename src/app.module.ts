import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginHistoryModule } from './login-history/login-history.module';
import * as dotenv from 'dotenv'
import { LoginHistory } from './login-history/entities/login-history-entity';

dotenv.config()

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User,LoginHistory], 
    synchronize: true,
  }),ConfigModule.forRoot({isGlobal: true}), UserModule, AuthModule, LoginHistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

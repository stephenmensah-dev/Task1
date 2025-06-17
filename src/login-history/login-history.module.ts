import { Module } from '@nestjs/common';
import { LoginHistoryService } from './login-history.service';
import { LoginHistoryController } from './login-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginHistory } from './entities/login-history-entity';

@Module({
  imports:[TypeOrmModule.forFeature([LoginHistory])],
  controllers: [LoginHistoryController],
  providers: [LoginHistoryService],
  exports: [LoginHistoryService],
})
export class LoginHistoryModule {}

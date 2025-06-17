import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginHistory } from './entities/login-history-entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LoginHistoryService {
    constructor(
        @InjectRepository(LoginHistory)
        private historyRepo:  Repository<LoginHistory>
    ){}

    async record(user: User, event: 'LOGIN' | 'LOGOUT' | 'REFRESH',) {
        const history = this.historyRepo.create({
          user,
          event
        });
        
        await this.historyRepo.save(history);
    }

    async findAll(){
        await this.historyRepo.find()
    }
      
}

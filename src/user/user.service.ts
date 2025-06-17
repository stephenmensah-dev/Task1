import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ){}


  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    
    const user = this.userRepo.create({
    ...createUserDto,
    password: hashedPassword,
    });
    console.log('User Registered \n')
    
    return this.userRepo.save(user)
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email })

    if(!user){
      throw new NotFoundException('User Not Found')
    }

    return user
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id })

    if(!user){
      throw new NotFoundException('User Not Found')
    }

    return user
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepo.update(id, updateUserDto)
    return this.userRepo.findOneBy({id})
  }

  async remove(id: number) {
    await this.userRepo.delete(id)
  }
}

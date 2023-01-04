import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { passwordHasher } from 'src/helper/passwordHasher';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository:Repository<User>){}
  async create(createUserDto: CreateUserDto) {
    try {
      const { firstName,lastName, email,password } = createUserDto;
      const newPassword = await passwordHasher(password)
      const user = this.userRepository.create({
        firstName,lastName, email ,password:newPassword
      });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      if(error.code==23505){
        throw new ConflictException(`email already exists`);
      }
      else throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try { 
      const user =await this.userRepository.find({where:{isActive:true},relations: {
        blogs: true,
    }});
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

 async findOne(id: string) {
  try {
    const user = await this.userRepository.findOne({where: {id,isActive:true}, relations: {
      blogs: true,
  },});
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  } catch (error) {
    if (error.response) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
    throw new InternalServerErrorException();
  }
  }

 async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const body = { ...updateUserDto };
      const user = await this.userRepository.update(id, body);
      if (user.affected === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return { message: 'User updated successfully' };
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.update(id,{isActive: false});
      if (user.affected === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
      throw new InternalServerErrorException();
    }
  }
}

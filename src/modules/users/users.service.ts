import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  generateAccessToken,
  generateRefreshToken,
} from 'src/utils/helper/jwt.helper';
import {
  passwordHasher,
  validatePassword,
} from 'src/utils/helper/passwordHasher';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CurrentUserInterface } from './interface/currentUser.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { firstName, lastName, email, password } = createUserDto;
      const newPassword = await passwordHasher(password);
      const user = this.userRepository.create({
        firstName,
        lastName,
        email,
        password: newPassword,
      });
      await this.userRepository.save(user );
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);
      await this.userRepository.update(user.id,{refreshToken} );

      return { accessToken, refreshToken };
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException(`email already exists`);
      }
      console.log(error)
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
         else throw new InternalServerErrorException();
    }
  }

  async getMe(currentUser: CurrentUserInterface) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: currentUser.id, isActive: true },
        relations: {
          blogs: true,
        },
      });
      if (!user) {
        throw new NotFoundException(
          `User with id ${currentUser?.id} not found`,
        );
      }
      return user;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      } else throw new InternalServerErrorException();
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email, isActive: true },
        relations: {
          blogs: true,
        },
        select: {
          email: true,
          password: true,
          isActive: true,
          id: true,
          firstName: true,
          lastName: true,
        },
      });
      if (!user) {
        throw new BadRequestException(`Invalid credentials`);
      }
      const isCorrectPassword = await validatePassword(password, user.password);
      if (!isCorrectPassword) {
        throw new BadRequestException(`Invalid credentials`);
      }
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);
      const updateRefreshToken = await this.userRepository.update(user.id, {
        refreshToken,
      });
      if (updateRefreshToken.affected === 1) {
        return { accessToken, refreshToken };
      }
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      } else throw new InternalServerErrorException();
    }
  }

  async update(
    updateUserDto: UpdateUserDto,
    currentUser: CurrentUserInterface,
  ) {
    try {
      const body = { ...updateUserDto };
      const user = await this.userRepository.update(
        { id: currentUser?.id, isActive: true },
        body,
      );
      if (!user || user.affected === 0) {
        throw new NotFoundException(
          `User with id ${currentUser?.id} not found`,
        );
      }
      return { message: 'User updated successfully' };
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      } else throw new InternalServerErrorException();
    }
  }

  async remove(currentUser: CurrentUserInterface) {
    try {
      const user = await this.userRepository.update(
        { id: currentUser?.id, isActive: true },
        { isActive: false },
      );
      if (user.affected === 0) {
        throw new NotFoundException(
          `User with id ${currentUser?.id} not found`,
        );
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      } else throw new InternalServerErrorException();
    }
  }
}

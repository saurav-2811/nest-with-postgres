import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CurrentUserInterface } from '../users/interface/currentUser.interface';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}
  async create(
    createBlogDto: CreateBlogDto,
    currentUser: CurrentUserInterface,
  ) {
    try {
      const userId = currentUser.id;
      const { title, description } = createBlogDto;
      const blog = this.blogRepository.create({
        title,
        description,
        user: userId as never,
      });
      await this.blogRepository.save(blog);
      return blog;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
      else throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const blog = await this.blogRepository.find({
        relations: {
          user: true,
        },
      });
      return blog;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
      else throw new InternalServerErrorException();
    }
  }

  async findMyAllBlog( currentUser: CurrentUserInterface){
    try {
      const userId = currentUser.id;
      const allBlog=await this.blogRepository.find({where:{user:{id:userId}},
        relations: {
          user: true,
        },
      });
      return allBlog
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
      else throw new InternalServerErrorException();
      
    }

  }

  async findOne(id: string) {
    try {
      const blog = await this.blogRepository.findOne({ where: { id: id }, relations: {
        user: true,
      } });
      if (!blog) {
        throw new NotFoundException(`Blog with id ${id} not found`);
      }
      return blog;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
     else throw new InternalServerErrorException();
    }
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    currentUser: CurrentUserInterface,
  ) {
    try {
      const body = { ...updateBlogDto };
      const user = currentUser.id;
      const findBlog = await this.blogRepository.findOne({
        where: { id: id },
        relations: { user: true },
      });
      if (findBlog?.user?.id === user) {
        const Blog = await this.blogRepository.update({ id }, body);
        if (Blog.affected === 0) {
          throw new NotFoundException(`Blog with id ${id} not found`);
        }
        return { message: 'Blog updated successfully' };
      } else
        throw new UnauthorizedException('Not authorised to update this blog');
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
     else throw new InternalServerErrorException();
    }
  }

  async remove(id: string, currentUser: CurrentUserInterface) {
    try {
      const user = currentUser.id;
      const findBlog = await this.blogRepository.findOne({
        where: { id: id },
        relations: { user: true },
      });
      if (findBlog?.user?.id === user) {
        const blog = await this.blogRepository.delete(id);
        if (blog?.affected === 0) {
          throw new NotFoundException(`Blog with id ${id} not found`);
        }
        return { message: 'Blog deleted successfully' };
      } else
        throw new UnauthorizedException('Not authorised to delete this blog');
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
     else throw new InternalServerErrorException();
    }
  }
}

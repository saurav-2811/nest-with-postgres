import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(@InjectRepository(Blog) private readonly blogRepository: Repository<Blog>){}
  async create(createBlogDto: CreateBlogDto) {
    try {
      const { title, description } = createBlogDto;
      const blog = this.blogRepository.create({
        title,
        description,
      });
      await this.blogRepository.save(blog);
      return blog;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try { 
      const blog =await this.blogRepository.find();
      return blog;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string) {
    try {
      const blog = await this.blogRepository.findOne({ where: { id: id } });
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
      throw new InternalServerErrorException();
    }
  }

 async update(id: string, updateBlogDto: UpdateBlogDto) {
    try {
      const body = { ...updateBlogDto };
      const Blog = await this.blogRepository.update(id, body);
      if (Blog.affected === 0) {
        throw new NotFoundException(`Blog with id ${id} not found`);
      }
      return { message: 'Blog updated successfully' };
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
    const blog = await this.blogRepository.delete(id);
    if (blog?.affected === 0) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return { message: 'Blog deleted successfully' };
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

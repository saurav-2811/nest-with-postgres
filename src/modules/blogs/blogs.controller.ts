import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/decorators/getUserDecorator';
import { UserAuthGuard } from 'src/gaurd/user-auth.gaurd';
import { User } from '../users/entities/user.entity';
import { CurrentUserInterface } from '../users/interface/currentUser.interface';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  create(
    @Body() createBlogDto: CreateBlogDto,
    @GetUser() currentUser: CurrentUserInterface,
  ) {
    return this.blogsService.create(createBlogDto, currentUser);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  @UseGuards(UserAuthGuard)
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }
  @Get('get/my-all-blogs')
  @UseGuards(UserAuthGuard)
  myAllLog(@GetUser() currentUser: CurrentUserInterface) {
    return this.blogsService.findMyAllBlog(currentUser);
  }

  @Patch(':id')
  @UseGuards(UserAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @GetUser() currentUser: CurrentUserInterface,
  ) {
    return this.blogsService.update(id, updateBlogDto, currentUser);
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  remove(
    @Param('id') id: string,
    @GetUser() currentUser: CurrentUserInterface,
  ) {
    return this.blogsService.remove(id, currentUser);
  }
}

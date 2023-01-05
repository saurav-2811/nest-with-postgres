import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserAuthGuard } from 'src/gaurd/user-auth.gaurd';
import { GetUser } from 'src/decorators/getUserDecorator';
import { CurrentUserInterface } from './interface/currentUser.interface';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get("getme")
  @UseGuards(UserAuthGuard)
  getMe(@GetUser() currentUser: CurrentUserInterface) {
    return this.usersService.getMe(currentUser);
  }

  @Post('login')
  login(@Body() loginUserDto:LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Patch()
  @UseGuards(UserAuthGuard)
  update( @Body() updateUserDto: UpdateUserDto, @GetUser() currentUser: CurrentUserInterface) {
    return this.usersService.update( updateUserDto,currentUser);
  }

  @Delete()
  @UseGuards(UserAuthGuard)
  remove(@GetUser() currentUser: CurrentUserInterface) {
    return this.usersService.remove(currentUser);
  }
}

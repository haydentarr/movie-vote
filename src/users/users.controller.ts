import { Controller, Post, Body, Get, Patch, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../common/custom.decorator';

import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-users.dto';
import { UpdateUserDTO } from './dto/update-users.dto';
import { User } from './users.model';
import { UserGuard } from '../common/user.roles.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Validate name and password, uuid is validated by auth guard
  @UseGuards(AuthGuard('jwt'))
  @Post()
  addUser(@AuthUser() user: Partial<User>, @Body() data: CreateUserDTO): User {
    Logger.log(user);
    return this.usersService.insertUser(user.uuid, data);
  }

  // For development only
  @Get('all')
  getAllUsers(): object {
    return this.usersService.getUsers();
  }

  // Get current user, no validation
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUser(@AuthUser() user: any): User {
    return this.usersService.getUser(user);
  }

  // Update current user, name and password need validation, uuid validated with authguard
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @Patch()
  updateUser(@AuthUser() user: Partial<User>, @Body() updates: UpdateUserDTO): object {
    this.usersService.updateUser(user.email, updates);
    return { message: 'User updated' };
  }
}

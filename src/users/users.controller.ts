import { Controller, Post, Body, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../common/custom.decorator'

import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-users.dto';
import { UpdateUserDTO } from './dto/update-users.dto';
import { User } from './users.model';


@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Validate name and password, uuid is validated by auth guard
    @UseGuards(AuthGuard('jwt'))
    @Post()
    addUser(@AuthUser() user: Partial<User>, @Body() data: CreateUserDTO): User {
        return this.usersService.insertUser(user.uuid, data);
    }

    // For development only
    // @Get()
    // getAllUsers(): object {
    //     return this.usersService.getUsers();
    // }

    // Get current user, no validation
    @UseGuards(AuthGuard('jwt'))
    @Get()
    getUser(@AuthUser() user: Partial<User>): User {
        return this.usersService.getUser(user.email);
    }

    // Update current user, name and password need validation, uuid validated with authguard
    @UseGuards(AuthGuard('jwt'))
    @Patch()
    updateUser(@AuthUser() user: Partial<User>, @Body() updates: UpdateUserDTO): object {
        this.usersService.updateUser(user.email, updates);
        return { message: 'User updated' };
    }
}
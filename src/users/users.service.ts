import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from './users.model';
import { CreateUserDTO } from './dto/create-users.dto';
import { UpdateUserDTO } from './dto/update-users.dto';

// TODO
// THINK ABOUT A BETTER CONFLICT CHECK
// Move to database

@Injectable()
export class UsersService {

    private users: User[] = [];

    // SHOULD NOT RETURN USER BUT ONLY SUCCESS
    insertUser(uuid: User["uuid"], data: CreateUserDTO): User {

        const user = this.findUser(data.email);
        if (user[0]) throw new ConflictException; // Error if user name exists already

        const newUser = new User(
            uuid,
            data.email,
            data.name,
            data.password
        ) 
        this.users.push(newUser);
        return newUser;
    }

    // Dev only operation
    // getUsers(): object {
    //     return [...this.users];
    // }

    // Return an existing user - used during login and signup for email conflict checking
    getUser(email: User["email"]): User {
        const user = this.findUser(email);
        if (user) {
            return { ...user[0] }
        }
        return null;
    }

    // Patch an existing user - Can patch email, name, or password
    updateUser(email: User["email"], update: UpdateUserDTO): void {
        const [user, index] = this.findUser(email);
        if (!user) throw new NotFoundException;

        const updatedUser = { ...user, ...update }; // Merge updates (name, email, password) with existing user
        this.users[index] = updatedUser;
    }

    // Shared find user function used when performing user CRUD and Auth operations
    private findUser(email: User["email"]): [User, number] {
        const userIndex = this.users.findIndex(user => user.email === email);
        const user = this.users[userIndex];
        return [user, userIndex];
    }

}
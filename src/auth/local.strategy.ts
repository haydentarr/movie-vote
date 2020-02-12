import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as classValidator from 'class-validator';
import { plainToClass } from 'class-transformer';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { User } from '../users/users.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    ) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(email: string, password: string): Promise< Partial<User> > {

    const loginDetails = plainToClass(LoginDTO, {email, password})

    const validCheck = await classValidator.validate(loginDetails);
    if (validCheck.length) throw new BadRequestException(validCheck);

    const user = await this.authService.validateUser(email, password);
    if (!user) throw new NotFoundException();

    return user;
  }
}
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as createUUID } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../common/jwt-secrets';

import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';
import { Tokens, Jwt } from './auth.interface';
import { throwError } from 'rxjs';

// Change tokens to environment variables

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  private blacklist: Tokens[] = [];

  /*
   * Login user and persist session by sending refresh cookie to client.
   * Include accesstoken in body response.
   */
  async login(user: User): Promise<Tokens> {
    return this.getTokens({ sub: { uuid: user.uuid, email: user.email, name: user.name, role: 'user' } });
  }

  /*
   * Guest sessions are created for anonymous users, and converted to users if they create an account
   */
  async guestSession(token?: any): Promise<Tokens> {
    const existing = await this.verifyToken(token); // If guest has valid cookie, return only access token
    if (existing && existing.sub.role === 'user') throw new BadRequestException('Error: You already have an account');
    if (existing) return this.getAccessToken({ sub: existing.sub });

    Logger.log(existing);
    return this.getTokens({
      sub: { uuid: createUUID(), role: 'guest' },
    }); // New guest
  }

  /*
   * Refresh access token by
   */
  async refreshToken(token: string): Promise<Tokens> {
    const valid = await this.verifyToken(token); // Check if refresh token is valid
    if (!valid) throw new BadRequestException(); // If ROLE is user redirect to Logout if ROLE is Guest

    return this.getAccessToken({ sub: valid.sub });
  }

  // ADD expiredToken function
  // Check is USER or GUEST
  // If GUEST
  // Remove uuid and all ranks from memory
  // Remove cookie
  // Redirect to guest
  // If USER
  // Removie cookie
  // Optional add cookie for user remember email
  // Redirect to login

  // async logout(user: User): Promise<object> {
  // Add token to blacklist
  // Store refresh and expiry
  // Store current access token in memory if any
  //
  // }

  /*--------------------------------------------------------
   ** HELPER FUNCTIONS BELOW
   **--------------------------------------------------------*/

  private async verifyToken(token: string) {
    try {
      if (!token) return;
      return jwt.verify(token, jwtConstants.tokenSecret) as any;
    } catch (err) {
      // Remove user from memory
      //
      return false;
    }
  }

  private getAccessToken(payload: object) {
    return { accessToken: this.jwtService.sign(payload) };
  }

  private getTokens(payload: object): Tokens {
    return {
      refreshToken: jwt.sign(payload, jwtConstants.tokenSecret, { expiresIn: '15s' }),
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, pass: string): Promise<Partial<User>> {
    const user: User = this.usersService.getUser(email);

    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

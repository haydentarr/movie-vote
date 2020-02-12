import { Controller, Req, Post, UseGuards, Get, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthUser } from '../common/custom.decorator';
import { User } from '../users/users.model';
import { SetRefreshCookie } from './interceptors/set-refresh.interceptor';
import { ClearRefreshCookie } from './interceptors/clear-refresh.interceptor';

// IMPLEMENT AUTH ROLES

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @UseInterceptors(new SetRefreshCookie()) // Adds refresh cookie before response is returned
  @Post('login')
  async login(@AuthUser() user: User): Promise<object> {
    return this.authService.login(user);
  }

  @Get('guest')
  @UseInterceptors(new SetRefreshCookie())
  async guestSession(@Req() req): Promise<object> {
    return this.authService.guestSession(req.cookies.jwt);
  }

  @Get('refresh')
  async refreshToken(@Req() req): Promise<object> {
    return this.authService.refreshToken(req.cookies.jwt);
  }

  @Get('logout')
  @UseInterceptors(new ClearRefreshCookie()) // Clears refresh cookie before response is returned
  // eslint-disable-next-line class-methods-use-this
  logout(): object {
    return { message: 'Sucessfully logged out' };
  }
}

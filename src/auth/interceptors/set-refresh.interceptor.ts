import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class SetRefreshCookie implements NestInterceptor {
  // eslint-disable-next-line class-methods-use-this
  intercept(
    context: ExecutionContext,
    next: CallHandler,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    return next
      .handle()
      .toPromise()
      .then(res => {
        Logger.log(res.refreshToken);
        if (!res.refreshToken) return res;

        response.cookie('jwt', res.refreshToken, { httpOnly: true, sameSite: true });
        delete res.refreshToken;
        return res || undefined;
      });
  } //
}

// if res.refreshToken is empty add cookie

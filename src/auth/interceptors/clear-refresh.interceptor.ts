import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { Response } from 'express';

  @Injectable()
  export class ClearRefreshCookie implements NestInterceptor {
    // eslint-disable-next-line class-methods-use-this
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise< Observable<any> > {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse<Response>();
      const res$ = next.handle();
      return res$.toPromise().then(res => {
        response.clearCookie('jwt');
        return res || undefined;
      });
    }// 
  }
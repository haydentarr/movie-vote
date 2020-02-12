import { createParamDecorator,  PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

interface CustomRequest extends Request {
    user?: object;
    query?: {movies: string};
}

export const AuthUser = createParamDecorator( (_data, request) => request.user);

@Injectable()
export class ParseToIntArray implements PipeTransform<string, number[]> {
  // eslint-disable-next-line class-methods-use-this
  transform(value: string): number[] {
    if (!value) throw new BadRequestException('Movies missing from request'); 

    const val = value.split(',').filter( (v, i, a) => !Number.isNaN(Number(v)) && a.indexOf(v) === i).map(Number);
    
    if (!val) throw new BadRequestException('Validation failed'); 
    if (val.length <= 1) throw new BadRequestException('Two unique movies are required'); 
 
    return val;
  }
}
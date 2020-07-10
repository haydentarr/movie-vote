import { createParamDecorator, PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

// Break these into separate files
export const AuthUser = createParamDecorator((_data, request) => request.user);

// Break these into separate files

@Injectable()
export class ParseToIntArray implements PipeTransform<string, number[]> {
  // eslint-disable-next-line class-methods-use-this
  transform(value: string): number[] {
    if (!value) throw new BadRequestException('Movies missing from request');

    const val = value
      .split(',')
      .filter((v, i, a) => !Number.isNaN(Number(v)) && a.indexOf(v) === i)
      .map(Number);

    if (!val) throw new BadRequestException('Validation failed');
    if (val.length <= 1) throw new BadRequestException('Two unique movies are required');

    return val;
  }
}

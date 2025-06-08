import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseDto } from 'src/shared/dtos/responses/base.response';

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Cách 1: Kiểm tra bằng string literal type
    if (context.getType<'graphql'>() === 'graphql') {
      return next.handle(); // Không wrap nếu là GraphQL
    }

    return next.handle().pipe(
      map((data) => new ResponseDto(200, 'Success', data)),
    );
  }
}
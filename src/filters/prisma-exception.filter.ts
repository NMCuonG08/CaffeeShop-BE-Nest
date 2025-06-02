
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    switch (exception.code) {
      case 'P2002':
        response.status(409).json({
          statusCode: 409,
          message: 'Dữ liệu đã tồn tại (trùng khóa)',
        });
        break;
      case 'P2003':
        response.status(400).json({
          statusCode: 400,
          message: 'Vi phạm khóa ngoại',
        });
        break;
      default:
        response.status(500).json({
          statusCode: 500,
          message: 'Lỗi hệ thống không xác định',
        });
    }
  }
}

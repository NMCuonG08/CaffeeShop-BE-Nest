import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  Res,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { VNPayService, CreatePaymentUrlDto, VNPayReturnQuery } from './vnpay.service';

@Controller('vnpay')
export class VNPayController {
  constructor(private readonly vnpayService: VNPayService) {}

  @Post('create-payment-url')
  createPaymentUrl(
    @Body() createPaymentDto: Omit<CreatePaymentUrlDto, 'clientIp'>,
    @Req() req: Request,
  ) {
    const clientIp = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const paymentData: CreatePaymentUrlDto = {
      ...createPaymentDto,
      clientIp: clientIp as string,
    };
    const paymentUrl = this.vnpayService.createPaymentUrl(paymentData);
    return {
      success: true,
      paymentUrl,
    };
  }

  @Get('return')
  vnpayReturn(
    @Query() query: VNPayReturnQuery,
    @Res() res: Response,
  ) {
    const result = this.vnpayService.verifyReturnUrl(query);

    if (result.isValid) {
      // Redirect đến trang thành công
      return res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${query.vnp_TxnRef}`);
    } else {
      // Redirect đến trang thất bại
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?orderId=${query.vnp_TxnRef}&message=${result.message}`);
    }
  }

  @Get('ipn')
  vnpayIPN(
    @Query() query: any,
    @Res() res: Response,
  ) {
    const result = this.vnpayService.verifyIpnCall(query);
    return res.status(HttpStatus.OK).json(result);
  }
}
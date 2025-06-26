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

    // Tạo URL params từ VNPay query để chuyển đến frontend
    const urlParams = new URLSearchParams();

    // Chuyển tất cả VNPay parameters quan trọng
    if (query.vnp_ResponseCode) urlParams.append('vnp_ResponseCode', query.vnp_ResponseCode);
    if (query.vnp_TxnRef) urlParams.append('vnp_TxnRef', query.vnp_TxnRef);
    if (query.vnp_Amount) urlParams.append('vnp_Amount', query.vnp_Amount.toString());
    if (query.vnp_BankCode) urlParams.append('vnp_BankCode', query.vnp_BankCode);
    if (query.vnp_PayDate) urlParams.append('vnp_PayDate', query.vnp_PayDate);
    if (query.vnp_TransactionNo) urlParams.append('vnp_TransactionNo', query.vnp_TransactionNo);

    // Luôn redirect đến vnpay-callback với tất cả parameters
    // Frontend sẽ tự xử lý logic thành công/thất bại dựa trên vnp_ResponseCode
    const callbackUrl = `${process.env.FRONTEND_URL}/payment/vnpay-callback?${urlParams.toString()}`;

    console.log('VNPay callback redirect URL:', callbackUrl);

    return res.redirect(callbackUrl);
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
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as moment from 'moment';
import * as qs from 'qs';
import { vnpayConfig } from './vnpay.config';

export interface CreatePaymentUrlDto {
  orderId: string;
  amount: number;
  orderDescription: string;
  orderType: string;
  locale?: string;
  currCode?: string;
  clientIp: string;
}

export interface VNPayReturnQuery {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHashType?: string;
  vnp_SecureHash?: string;
}

@Injectable()
export class VNPayService {
  private sortObject(obj: any): any {
    const sorted: Record<string, string> = {};
    const str: string[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }

    str.sort();

    for (const key of str) {
      sorted[key] = encodeURIComponent(obj[decodeURIComponent(key)]).replace(/%20/g, '+');
    }

    return sorted;
  }

  createPaymentUrl(paymentData: CreatePaymentUrlDto): string {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const vnpParams: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Locale: paymentData.locale || 'vn',
      vnp_CurrCode: paymentData.currCode || 'VND',
      vnp_TxnRef: paymentData.orderId,
      vnp_OrderInfo: paymentData.orderDescription,
      vnp_OrderType: paymentData.orderType,
      vnp_Amount: paymentData.amount * 100, // VNPay yêu cầu amount * 100
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_IpAddr: paymentData.clientIp,
      vnp_CreateDate: createDate,
    };

    const sortedParams = this.sortObject(vnpParams);
    const queryString = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(queryString, 'utf-8')).digest('hex');

    return `${vnpayConfig.vnp_Url}?${queryString}&vnp_SecureHash=${signed}`;
  }

  verifyReturnUrl(vnpParams: VNPayReturnQuery): {
    isValid: boolean;
    message: string;
    code: string;
  } {
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const sortedParams = this.sortObject(vnpParams);
    const queryString = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(queryString, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      if (vnpParams.vnp_ResponseCode === '00') {
        return {
          isValid: true,
          message: 'Giao dịch thành công',
          code: '00'
        };
      } else {
        return {
          isValid: false,
          message: 'Giao dịch thất bại',
          code: vnpParams.vnp_ResponseCode
        };
      }
    } else {
      return {
        isValid: false,
        message: 'Chữ ký không hợp lệ',
        code: '97'
      };
    }
  }

  verifyIpnCall(vnpParams: any): {
    RspCode: string;
    Message: string;
  } {
    const secureHash = vnpParams.vnp_SecureHash;
    const orderId = vnpParams.vnp_TxnRef;
    const rspCode = vnpParams.vnp_ResponseCode;

    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const sortedParams = this.sortObject(vnpParams);
    const queryString = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(queryString, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      // Kiểm tra orderId có tồn tại trong database không
      // Kiểm tra amount có khớp với order không
      // Kiểm tra trạng thái order

      if (rspCode === '00') {
        // Cập nhật trạng thái order thành công
        return { RspCode: '00', Message: 'Confirm Success' };
      } else {
        // Cập nhật trạng thái order thất bại
        return { RspCode: '00', Message: 'Confirm Success' };
      }
    } else {
      return { RspCode: '97', Message: 'Invalid Signature' };
    }
  }
}
export interface VNPayConfig {
  readonly vnp_TmnCode: string;
  readonly vnp_HashSecret: string;
  readonly vnp_Url: string;
  readonly vnp_ApiUrl: string;
  readonly vnp_ReturnUrl: string;
  readonly vnp_IpnUrl: string;
}

export interface CreatePaymentRequest {
  readonly amount: number;
  readonly orderId: string;
  readonly orderInfo: string;
  readonly orderType?: string;
  readonly locale?: 'vn' | 'en';
}

export interface VNPayParams {
  [key: string]: string | number;
}

export interface PaymentResponse {
  readonly success: boolean;
  readonly message: string;
  readonly data?: {
    readonly paymentUrl?: string;
    readonly orderId?: string;
    readonly amount?: number;
    readonly transactionId?: string;
    readonly payDate?: string;
  };
}

export interface VNPayReturnParams {
  readonly vnp_Amount: string;
  readonly vnp_BankCode: string;
  readonly vnp_BankTranNo: string;
  readonly vnp_CardType: string;
  readonly vnp_OrderInfo: string;
  readonly vnp_PayDate: string;
  readonly vnp_ResponseCode: string;
  readonly vnp_TmnCode: string;
  readonly vnp_TransactionNo: string;
  readonly vnp_TransactionStatus: string;
  readonly vnp_TxnRef: string;
  readonly vnp_SecureHash: string;
}

export interface QueryTransactionRequest {
  readonly orderId: string;
  readonly transDate: string;
}

export type VNPayResponseCode =
  | '00' // Thành công
  | '07' // Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).
  | '09' // Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.
  | '10' // Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần
  | '11' // Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.
  | '12' // Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.
  | '13' // Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.
  | '24' // Giao dịch không thành công do: Khách hàng hủy giao dịch
  | '51' // Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.
  | '65' // Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.
  | '75' // Ngân hàng thanh toán đang bảo trì.
  | '79' // Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch
  | '99'; // Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)

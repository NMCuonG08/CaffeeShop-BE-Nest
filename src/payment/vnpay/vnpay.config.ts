export interface VNPayConfig {
  vnp_TmnCode: string;
  vnp_HashSecret: string;
  vnp_Url: string;
  vnp_ReturnUrl: string;
  vnp_IpnUrl: string;
}

export const vnpayConfig: VNPayConfig = {
  vnp_TmnCode: process.env.VNPAY_TMN_CODE || 'your_tmn_code',
  vnp_HashSecret: process.env.VNPAY_HASH_SECRET || 'your_hash_secret',
  vnp_Url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:5173/vnpay/return',
  vnp_IpnUrl: process.env.VNPAY_IPN_URL || 'http://localhost:3000/vnpay/ipn',
};
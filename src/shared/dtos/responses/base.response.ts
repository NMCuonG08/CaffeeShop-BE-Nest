export class ResponseDto<T> {
  statusCode: number;
  message: string;
  data?: T;
  constructor(
    statusCode: number,
    message: string,
    data?: T
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export type SafeUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
};


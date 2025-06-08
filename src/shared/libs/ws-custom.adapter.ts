import { INestApplicationContext } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

export class CustomWsAdapter extends WsAdapter {
  constructor(app: INestApplicationContext) {
    super(app);
  }

  // Method mới yêu cầu trong NestJS v11
  bindClientConnect(server: any, callback: Function) {
    server.on('connection', callback);
  }
}

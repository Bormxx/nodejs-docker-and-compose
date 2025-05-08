import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  someText(): string {
    return 'Hello World!';
  }
}

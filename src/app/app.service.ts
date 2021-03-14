import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, world!'
  }

  getHelloName(name: string): string {
    return `Hello ${name}!`
  }
}

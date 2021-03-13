import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Prisma example using NestJS.'
  }
  getHelloName(name: string): string {
    return `Hello ${name}!`
  }
}

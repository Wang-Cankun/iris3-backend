import { Module } from '@nestjs/common'
import { PasswordService } from '../auth/password.service'
import { PrismaService } from '../prisma/prisma.service'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  providers: [UserResolver, UserService, PasswordService, PrismaService]
})
export class UserModule {}

import { PostResolver } from './post.resolver'
import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  providers: [PostResolver, PrismaService]
})
export class PostModule {}

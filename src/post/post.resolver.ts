import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { PaginationArgs } from '../common/pagination/pagination.args'
import { PostIdArgs } from './model/args/post-id.args'
import { UserIdArgs } from './model/args/user-id.args'
import { PrismaService } from '../prisma/prisma.service'
import { Post } from './model/post.model'
import { PostOrder } from './model/inputs/post-order.input'
import { PostConnection } from './model/pagination/post-connection.model'

@Resolver((of) => Post)
export class PostResolver {
  constructor(private prisma: PrismaService) {}

  @Query((returns) => PostConnection)
  async publishedPosts(
    @Args() { skip, after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => PostOrder,
      nullable: true
    })
    orderBy: PostOrder
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.post.findMany({
          include: { author: true },
          where: {
            published: true,
            title: { contains: query || '' }
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : null,
          ...args
        }),
      () =>
        this.prisma.post.count({
          where: {
            published: true,
            title: { contains: query || '' }
          }
        }),
      { first, last, before, after }
    )
    return a
  }

  @Query((returns) => [Post])
  userPosts(@Args() id: UserIdArgs) {
    return this.prisma.user
      .findUnique({ where: { id: id.userId } })
      .posts({ where: { published: true } })

    // or
    // return this.prisma.posts.findMany({
    //   where: {
    //     published: true,
    //     author: { id: id.userId }
    //   }
    // });
  }

  @Query((returns) => Post)
  async post(@Args() id: PostIdArgs) {
    return this.prisma.post.findUnique({ where: { id: id.postId } })
  }

  @ResolveField()
  async author(@Parent() post: Post) {
    return this.prisma.post.findUnique({ where: { id: post.id } }).author()
  }
}

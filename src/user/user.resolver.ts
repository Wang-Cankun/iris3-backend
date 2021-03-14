import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import { PrismaService } from '../prisma/prisma.service'
import { UserEntity } from './decorators/user.decorator'
import { ChangePasswordInput } from './dto/change-password.input'
import { UpdateUserInput } from './dto/update-user.input'
import { User } from './model/user.model'
import { UserService } from './user.service'

@Resolver((of) => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(
    private userService: UserService,
    private prisma: PrismaService
  ) {}

  @Query((returns) => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: UpdateUserInput
  ) {
    return this.userService.updateUser(user.id, newUserData)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((returns) => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.userService.changePassword(
      user.id,
      user.password,
      changePassword
    )
  }

  @ResolveField('posts')
  posts(@Parent() author: User) {
    return this.prisma.user.findUnique({ where: { id: author.id } }).posts()
  }
}

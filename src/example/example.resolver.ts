import { Inject, UseGuards } from '@nestjs/common'
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription
} from '@nestjs/graphql'
import { PubSub, PubSubEngine } from 'apollo-server-express'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import { UserService } from '../user/user.service'
import { GetExampleArgs } from './args/get-example.args'
import { UpdateExampleInput } from './dto/update.input'
import { Example } from './example.model'

const pubSub = new PubSub()

@Resolver((of) => Example)
export class ExampleResolver {
  @Query((returns) => Example)
  async getMe(example: Example): Promise<Example> {
    return example
  }

  @Query((returns) => Example, { name: 'example' })
  async getexample(@Args() args: GetExampleArgs): Promise<Example> {
    const example = await { id: args.id, type: 'cluster', result: 123 }
    pubSub.publish('EXAMPLE_QUERY', { subExample: example })
    return example
  }

  // @ResolveField()
  // async posts(@Parent() example: Author) {
  //   const { id } = example
  //   return this.postService.findAll({ exampleId: id })
  // }

  // @UseGuards(GqlAuthGuard)
  @Mutation((returns) => Example)
  async updatePost(
    @Args('data') updateExampleData: UpdateExampleInput
  ): Promise<Example> {
    const example = await {
      id: updateExampleData.id,
      type: 'qc',
      result: 456
    }
    console.log(updateExampleData)
    pubSub.publish('EXAMPLE_MUTATION', { subExample: example })
    return example
  }

  //
  @Subscription((returns) => Example)
  subExample() {
    return pubSub.asyncIterator(['EXAMPLE_QUERY', 'EXAMPLE_MUTATION'])
  }
}

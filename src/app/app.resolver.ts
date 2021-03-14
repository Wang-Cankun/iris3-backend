import { Args, Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class AppResolver {
  @Query((_) => String)
  helloWorld(): string {
    return 'Hello, World!'
  }
  @Query(() => String)
  hello(@Args('name') name: string): string {
    return `Hello ${name}!`
  }
}

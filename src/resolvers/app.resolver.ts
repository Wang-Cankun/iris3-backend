import { Resolver, Query, Args } from '@nestjs/graphql'

@Resolver()
export class AppResolver {
  @Query((ofs) => String)
  helloWorld(): string {
    return 'Hello World!'
  }
  @Query(() => String)
  hello(@Args('name') name: string): string {
    return `Hi ${name}!`
  }

  @Query(() => String)
  hello2(@Args('id') id: string): string {
    return `Hello ${id}!`
  }

  @Query(() => String)
  hello3(@Args('id') id: string): string {
    return `Hello3 ${id}!`
  }
}

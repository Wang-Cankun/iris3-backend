import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Example {
  @Field((type) => Int)
  id: number

  @Field({ nullable: true })
  type?: string

  @Field((type) => [String], { nullable: true })
  result?: string[]
}

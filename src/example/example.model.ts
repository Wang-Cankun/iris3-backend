import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Example {
  @Field((type) => Int)
  id: number

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  result?: number
}

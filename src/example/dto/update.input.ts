import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class UpdateExampleInput {
  @Field()
  id: number

  @Field()
  params: string
}

import { Field, ObjectType } from '@nestjs/graphql'
import { BaseModel } from '../../app/model/base.model'
import { User } from '../../user/model/user.model'

@ObjectType()
export class Post extends BaseModel {
  title: string
  content: string
  published: boolean
  author: User
}

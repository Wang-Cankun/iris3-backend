import { HideField, ObjectType, registerEnumType } from '@nestjs/graphql'
import { BaseModel } from '../../app/model/base.model'
import { Post } from '../../post/model/post.model'

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role'
})

@ObjectType()
export class User extends BaseModel {
  email: string
  firstname?: string
  lastname?: string
  role: Role
  posts: Post[]
  @HideField()
  password: string
}

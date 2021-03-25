import { Module } from '@nestjs/common'
import { ExampleResolver } from './example.resolver'

@Module({
  imports: [],
  providers: [ExampleResolver]
})
export class ExampleModule {}

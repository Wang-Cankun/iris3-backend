import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AuthModule } from '../auth/auth.module'
import { DateScalar } from '../common/scalars/date.scalar'
import config from '../configs/config'
import { GraphqlConfig } from '../configs/config.interface'
import { PostModule } from '../post/post.module'
import { UserModule } from '../user/user.module'
import { AppController } from './app.controller'
import { AppResolver } from './app.resolver'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql')
        return {
          buildSchemaOptions: {
            numberScalarMode: 'integer'
          },
          sortSchema: graphqlConfig.sortSchema,
          autoSchemaFile:
            graphqlConfig.schemaDestination || '../src/schema.graphql',
          debug: graphqlConfig.debug,
          playground: graphqlConfig.playgroundEnabled,
          context: ({ req }) => ({ req })
        }
      },
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule,
    PostModule
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, DateScalar]
})
export class AppModule {}

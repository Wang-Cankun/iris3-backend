import { Config } from './config.interface'

const config: Config = {
  nest: {
    port: 3000
  },
  cors: {
    enabled: true
  },
  swagger: {
    enabled: true,
    title: 'IRIS3 backend',
    description: 'The IRIS3 backend API description',
    version: '0.1',
    path: 'api'
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10
  }
}

export default (): Config => config

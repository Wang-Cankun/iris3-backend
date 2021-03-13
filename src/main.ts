import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import compression from 'compression'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import {
  CorsConfig,
  NestConfig,
  SwaggerConfig
} from './configs/config.interface'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Validation
  app.useGlobalPipes(new ValidationPipe())

  const configService = app.get(ConfigService)
  const nestConfig = configService.get<NestConfig>('nest')
  const corsConfig = configService.get<CorsConfig>('cors')
  const swaggerConfig = configService.get<SwaggerConfig>('swagger')

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'IRIS3 backened')
      .setDescription(swaggerConfig.description || 'The IRIS3 API description')
      .setVersion(swaggerConfig.version || '1.0')
      .build()
    const document = SwaggerModule.createDocument(app, options)

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document)
  }

  // Add global prefix on all routes
  // app.setGlobalPrefix('/iris3/api')

  // Enable Express Compression
  app.use(compression())

  // Cors
  if (corsConfig.enabled) {
    app.enableCors()
  }

  await app.listen(process.env.PORT || nestConfig.port || 3000)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()

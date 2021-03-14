import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Prisma, User } from '@prisma/client'
import { SecurityConfig } from '../configs/config.interface'
import { PrismaService } from '../prisma/prisma.service'
import { SignupInput } from './dto/signup.input'
import { Token } from './model/token.model'
import { PasswordService } from './password.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    )

    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          role: 'USER'
        }
      })

      return this.generateToken({
        userId: user.id
      })
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${payload.email} already used.`)
      } else {
        throw new Error(e)
      }
    }
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`)
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    )

    if (!passwordValid) {
      throw new BadRequestException('Invalid password')
    }

    return this.generateToken({
      userId: user.id
    })
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } })
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId']
    return this.prisma.user.findUnique({ where: { id } })
  }

  generateToken(payload: { userId: string }): Token {
    const accessToken = this.jwtService.sign(payload)

    const securityConfig = this.configService.get<SecurityConfig>('security')
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: securityConfig.refreshIn
    })

    return {
      accessToken,
      refreshToken
    }
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token)

      return this.generateToken({
        userId
      })
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}

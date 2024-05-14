import { JwtStrategy } from './jwt-strategy'
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from 'src/routes/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entity/user.entity'
import { LocalStrategy } from './auth.strategy'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secret_key',
      signOptions: {
        expiresIn: '1d'
      }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}

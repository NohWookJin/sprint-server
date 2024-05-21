import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entity/user.entity'
import { RoutineModule } from '../routine/routine.module'
import { AnalysisModule } from '../analysis/analysis.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoutineModule, AnalysisModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}

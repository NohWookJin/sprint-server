import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AnalysisService } from './analysis.service'
import { AnalysisController } from './analysis.controller'
import { Analysis } from 'src/entity/analysis.entity'
import { Routine } from 'src/entity/routine.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Analysis, Routine])],
  controllers: [AnalysisController],
  providers: [AnalysisService]
})
export class AnalysisModule {}

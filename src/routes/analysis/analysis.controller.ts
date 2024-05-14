import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { AnalysisService } from './analysis.service'

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('/all')
  getAllAnalysis() {
    return this.analysisService.getAllRoutineAnalysis()
  }

  @Get(':routineId')
  getRoutineAnalysis(@Param('routineId', ParseIntPipe) routineId: number) {
    return this.analysisService.getRoutineAnalysis(routineId)
  }
}
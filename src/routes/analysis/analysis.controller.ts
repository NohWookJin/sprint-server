import { Controller, Get, Param, ParseIntPipe, UnauthorizedException, UseGuards } from '@nestjs/common'
import { AnalysisService } from './analysis.service'
import { UserInfo } from 'src/decorators/user-info-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  getAllAnalysis(@UserInfo() userInfo) {
    if (!userInfo) {
      throw new UnauthorizedException()
    }
    return this.analysisService.getAllRoutineAnalysis(userInfo.id)
  }

  @Get(':routineId')
  @UseGuards(JwtAuthGuard)
  getRoutineAnalysis(@UserInfo() userInfo, @Param('routineId', ParseIntPipe) routineId: number) {
    return this.analysisService.getRoutineAnalysis(userInfo.id, routineId)
  }
}

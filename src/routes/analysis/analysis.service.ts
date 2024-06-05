import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Routine } from 'src/entity/routine.entity'
import { Analysis } from 'src/entity/analysis.entity'
import * as moment from 'moment'
import * as cron from 'node-cron'
import { Moment } from 'moment-timezone'

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>,
    @InjectRepository(Analysis)
    private analysisRepository: Repository<Analysis>
  ) {
    this.scheduleRoutineUpdates()
  }

  async getAllRoutineAnalysis(userId: number) {
    const routines = await this.routineRepository.find({
      where: { userId: userId, isDeleted: false },
      relations: ['todos', 'blogs']
    })

    const analyses = []
    for (const routine of routines) {
      const analysisData = await this.calculateAnalysisData(routine)
      analyses.push({
        routineId: routine.id,
        routineName: routine.name,
        ...analysisData
      })
    }
    return analyses
  }

  async getRoutineAnalysis(userId: number, routineId: number) {
    const routine = await this.routineRepository.findOne({
      where: { userId: userId, id: routineId, isDeleted: false },
      relations: ['todos', 'blogs']
    })

    if (!routine) {
      throw new NotFoundException()
    }

    return this.calculateAnalysisData(routine)
  }

  private async calculateAnalysisData(routine: Routine, dailyCounts: number[] = null) {
    const logs = routine.routineType === 'blog' ? routine.blogs : routine.todos
    const startDate = moment(routine.date).utc().tz('Asia/Seoul').startOf('day')
    const currentDate = moment().utc().tz('Asia/Seoul').startOf('day')
    const daysSinceStart = currentDate.diff(startDate, 'days')

    if (!dailyCounts) {
      dailyCounts = new Array(365).fill(0)
      const existingAnalysis = await this.analysisRepository.findOne({ where: { routine: { id: routine.id } } })
      if (existingAnalysis && existingAnalysis.dailyCounts) {
        dailyCounts = JSON.parse(existingAnalysis.dailyCounts)
      }
    }

    for (let i = 0; i <= daysSinceStart && i < 365; i++) {
      dailyCounts[i] = 0
    }

    logs.forEach(log => {
      const logDate = moment(log.date).utc().tz('Asia/Seoul').startOf('day')
      const dayIndex = logDate.diff(startDate, 'days')
      if (dayIndex >= 0 && dayIndex < 365) {
        if (routine.routineType === 'todo' && log.completed) {
          dailyCounts[dayIndex]++
        } else if (routine.routineType === 'blog') {
          dailyCounts[dayIndex]++
        }
      }
    })

    const daysAchievedTarget = dailyCounts.filter(count => count >= routine.targetCount).length
    const continuity = this.calculateContinuity(dailyCounts, routine.targetCount, startDate)
    const average = Math.round((daysAchievedTarget / Math.min(daysSinceStart + 1, 365)) * 100)

    return {
      name: routine.name,
      date: startDate.toDate(),
      targetCount: routine.targetCount,
      continuity,
      average: Math.min(average, 100),
      dailyCounts: JSON.stringify(dailyCounts),
      startWith: startDate.toDate()
    }
  }

  async saveAnalysisData(routineId: number, analysisData: any) {
    const analysis = await this.analysisRepository.findOne({ where: { routine: { id: routineId } } })
    if (analysis) {
      analysis.continuity = analysisData.continuity
      analysis.average = analysisData.average
      analysis.dailyCounts = analysisData.dailyCounts
      analysis.startWith = analysisData.startWith
      await this.analysisRepository.save(analysis)
    } else {
      const newAnalysis = this.analysisRepository.create({
        ...analysisData,
        routine: { id: routineId }
      })
      await this.analysisRepository.save(newAnalysis)
    }
  }

  private calculateContinuity(dailyCounts: number[], targetCount: number, startDate: Moment) {
    let continuity = 0
    const start = moment(startDate).utc().tz('Asia/Seoul').startOf('day')
    const today = moment().utc().tz('Asia/Seoul').startOf('day')
    const daysSinceStart = today.diff(start, 'days')

    for (let i = 0; i <= daysSinceStart - 1; i++) {
      if (dailyCounts[i] >= targetCount) {
        continuity++
      } else {
        continuity = 0
      }
    }

    return continuity
  }

  private async updateAllRoutines() {
    const routines = await this.routineRepository.find({ relations: ['todos', 'blogs'] })
    for (const routine of routines) {
      let dailyCounts = new Array(365).fill(0)
      const existingAnalysis = await this.analysisRepository.findOne({ where: { routine: { id: routine.id } } })

      if (existingAnalysis) {
        dailyCounts = JSON.parse(existingAnalysis.dailyCounts)
        const daysSinceStart = moment()
          .utc()
          .tz('Asia/Seoul')
          .startOf('day')
          .diff(moment(routine.date).utc().tz('Asia/Seoul').startOf('day'), 'days')
        dailyCounts = dailyCounts.slice(0, daysSinceStart + 1)
        dailyCounts.length = 365
        dailyCounts.fill(0, daysSinceStart + 1)
        existingAnalysis.dailyCounts = JSON.stringify(dailyCounts)
        await this.analysisRepository.save(existingAnalysis)
      } else {
        const analysisData = {
          routine: { id: routine.id },
          continuity: 0,
          average: 0,
          dailyCounts: JSON.stringify(dailyCounts),
          startWith: moment(routine.date).utc().tz('Asia/Seoul').startOf('day').toDate()
        }
        await this.analysisRepository.save(analysisData)
      }

      const analysisData = await this.calculateAnalysisData(routine, dailyCounts)
      if (existingAnalysis) {
        existingAnalysis.continuity = analysisData.continuity
        existingAnalysis.average = analysisData.average
        existingAnalysis.dailyCounts = analysisData.dailyCounts
        existingAnalysis.startWith = analysisData.startWith
        await this.analysisRepository.save(existingAnalysis)
      } else {
        await this.analysisRepository.save(analysisData)
      }
    }
  }

  private scheduleRoutineUpdates() {
    cron.schedule(
      '0 0 * * *', // 자정마다 실행
      () => {
        this.updateAllRoutines()
      },
      {
        scheduled: true
      }
    )
  }

  async initializeAnalysisData(routine: Routine) {
    const dailyCounts = new Array(365).fill(0)
    const analysisData = {
      routine: routine,
      continuity: 0,
      average: 0,
      dailyCounts: JSON.stringify(dailyCounts),
      startWith: routine.date
    }
    await this.analysisRepository.save(analysisData)
  }
}

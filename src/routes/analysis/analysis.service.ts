import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Routine } from 'src/entity/routine.entity'
import { Analysis } from 'src/entity/analysis.entity'
import * as moment from 'moment'
import * as cron from 'node-cron'

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

  async getAllRoutineAnalysis() {
    const routines = await this.routineRepository.find({
      where: { isDeleted: false },
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

  async getRoutineAnalysis(routineId: number) {
    const routine = await this.routineRepository.findOne({
      where: { id: routineId, isDeleted: false },
      relations: ['todos', 'blogs']
    })

    if (!routine) {
      throw new NotFoundException()
    }

    return this.calculateAnalysisData(routine)
  }

  private async calculateAnalysisData(routine: Routine, dailyCounts: number[] = null) {
    const logs = routine.routineType === 'blog' ? routine.blogs : routine.todos
    const startDate = moment(routine.date).startOf('day')
    const currentDate = moment().startOf('day')
    const daysSinceStart = currentDate.diff(startDate, 'days')

    if (!dailyCounts) {
      dailyCounts = new Array(365).fill(0)
      const existingAnalysis = await this.analysisRepository.findOne({ where: { routine: { id: routine.id } } })
      if (existingAnalysis && existingAnalysis.dailyCounts) {
        dailyCounts = JSON.parse(existingAnalysis.dailyCounts)
      }
    }

    logs.forEach(log => {
      const logDate = moment(log.date).startOf('day')
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
    const continuity = this.calculateContinuity(dailyCounts, routine.targetCount)
    const average = (daysAchievedTarget / Math.min(daysSinceStart + 1, 365)) * 100

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

  private calculateContinuity(dailyCounts: number[], targetCount: number) {
    let continuity = 0
    let currentStreak = 0
    for (const count of dailyCounts) {
      if (count >= targetCount) {
        currentStreak++
      } else {
        continuity = Math.max(continuity, currentStreak)
        currentStreak = 0
      }
    }
    continuity = Math.max(continuity, currentStreak)
    return continuity
  }

  private async updateAllRoutines() {
    const routines = await this.routineRepository.find({ relations: ['todos', 'blogs'] })
    for (const routine of routines) {
      const analysis = await this.analysisRepository.findOne({ where: { routine: { id: routine.id } } })
      let dailyCounts = new Array(365).fill(0)

      if (analysis) {
        dailyCounts = JSON.parse(analysis.dailyCounts)
        const daysSinceStart = moment().startOf('day').diff(moment(routine.date).startOf('day'), 'days')
        dailyCounts = dailyCounts.slice(0, daysSinceStart + 1)
        analysis.dailyCounts = JSON.stringify(dailyCounts)
        await this.analysisRepository.save(analysis)
      } else {
        const analysisData = {
          routine: { id: routine.id },
          continuity: 0,
          average: 0,
          dailyCounts: JSON.stringify(dailyCounts),
          startWith: moment(routine.date).startOf('day').toDate()
        }
        await this.analysisRepository.save(analysisData)
      }

      const analysisData = await this.calculateAnalysisData(routine, dailyCounts)
      const existingAnalysis = await this.analysisRepository.findOne({ where: { routine: { id: routine.id } } })
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
        scheduled: true,
        timezone: 'Asia/Seoul'
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

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

  async getRoutineAnalysis(routineId: number) {
    const routine = await this.routineRepository.findOne({
      where: { id: routineId },
      relations: ['todos', 'blogs']
    })

    if (!routine) {
      throw new NotFoundException()
    }

    return this.calculateAnalysisData(routine)
  }

  private scheduleRoutineUpdates() {
    cron.schedule('0 0 * * *', () => {
      this.updateAllRoutines()
    })
  }

  private async updateAllRoutines() {
    const routines = await this.routineRepository.find({ relations: ['todos', 'blogs'] })

    for (const routine of routines) {
      const analysisData = await this.calculateAnalysisData(routine)
      analysisData.dailyCounts = new Array(365).fill(0)
      analysisData.dailyCounts[0] = routine.routineType === 'blog' ? routine.blogs.length : routine.todos.length // Initialize today's count
      await this.saveAnalysisData(routine.id, analysisData)
    }
  }

  private async calculateAnalysisData(routine: Routine) {
    const logs = routine.routineType === 'blog' ? routine.blogs : routine.todos
    const startDate = routine.date
    const endDate = new Date()
    const daysSinceStart = moment(endDate).diff(moment(startDate), 'days') + 1

    let daysAchievedTarget = 0
    let continuity = 0
    let currentStreak = 0

    const dailyCounts = new Array(365).fill(0)
    logs.forEach(log => {
      const daysAgo = moment(endDate).diff(moment(log.date), 'days')
      if (daysAgo < 365) {
        dailyCounts[daysAgo]++
      }
    })

    for (let day = 0; day < daysSinceStart; day++) {
      const checkDate = moment(startDate).add(day, 'days').toDate()
      const dailyCount = logs.filter(log => moment(log.date).isSame(checkDate, 'day')).length

      if (dailyCount >= routine.targetCount) {
        daysAchievedTarget++
        currentStreak++
      } else {
        continuity = Math.max(continuity, currentStreak)
        currentStreak = 0
      }
    }

    continuity = Math.max(continuity, currentStreak)

    const average = (daysAchievedTarget / daysSinceStart) * 100

    return {
      name: routine.name,
      date: routine.date,
      targetCount: routine.targetCount,
      continuity,
      average,
      dailyCounts
    }
  }

  private async saveAnalysisData(routineId: number, analysisData: any) {
    const analysis = await this.analysisRepository.findOne({ where: { routine: { id: routineId } } })
    if (analysis) {
      analysis.continuity = analysisData.continuity
      analysis.average = analysisData.average
      await this.analysisRepository.save(analysis)
    }
  }
}

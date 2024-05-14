import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoggingMiddleware } from './middleware/logging.middleware'
import ConfigModule from './config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './routes/user/user.module'
import { AuthModule } from './auth/auth.module'
import { RoutineModule } from './routes/routine/routine.module'
import { TodoModule } from './routes/todo/todo.module'
import { BlogModule } from './routes/blog/blog.module'
import { AnalysisModule } from './routes/analysis/analysis.module'
import { DailyRoutineModule } from './routes/daily-routine/daily-routine.module'

@Module({
  imports: [
    ConfigModule(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true
    }),
    UserModule,
    AuthModule,
    RoutineModule,
    TodoModule,
    BlogModule,
    AnalysisModule,
    DailyRoutineModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*')
  }
}

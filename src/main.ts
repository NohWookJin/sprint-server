import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { TodoService } from './routes/todo/todo.service'
import { BlogService } from './routes/blog/blog.service'
import * as cron from 'node-cron'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const todoService = app.get(TodoService)
  const blogService = app.get(BlogService)

  cron.schedule('0 0 * * *', () => {
    todoService.movePastTodos()
    // blogService.categorizePastBlogs()
  })

  const config = new DocumentBuilder()
    .setTitle('Sprint')
    .setDescription('Sprint API description')
    .setVersion('1.0')
    .addTag('Sprint')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}
bootstrap()

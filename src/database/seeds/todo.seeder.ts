// import { Todo } from 'src/entity/todo.entity'
// import { DataSource } from 'typeorm'
// import { Seeder, SeederFactoryManager } from 'typeorm-extension'

// export default class TodoSeeder implements Seeder {
//   async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
//     const todoRepository = dataSource.getRepository(Todo)

//     await todoRepository.save([
//       { content: 'Study algorithms', completed: true, routine: { id: 21 }, date: new Date('2024-03-22') },
//       { content: 'Learn Docker', completed: false, routine: { id: 21 }, date: new Date('2024-04-21') }
//     ])
//   }
// }

import { Blog } from 'src/entity/blog.entity'
import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

export default class BlogSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const blogRepository = dataSource.getRepository(Blog)

    await blogRepository.save([
      {
        title: '옛날 블로그입니다. (1)',
        content: 'Study algorithms',
        routine: { id: 20 },
        date: new Date('2024-03-22')
      },
      {
        title: '옛날 블로그입니다. (2)',
        content: 'Study algorithms',
        routine: { id: 20 },
        date: new Date('2024-03-22')
      },
      {
        title: '특별한 옛날 블로그입니다.',
        content: 'Learn Docker',
        routine: { id: 20 },
        date: new Date('2024-03-21')
      },
      {
        title: '멋있는 옛날 블로그입니다.',
        content: 'Learn Docker',
        routine: { id: 20 },
        date: new Date('2024-03-20')
      },
      { title: '멋진 옛날 블로그입니다.', content: 'Learn Docker', routine: { id: 20 }, date: new Date('2024-03-19') },
      { title: '더운 옛날 블로그입니다.', content: 'Learn Docker', routine: { id: 20 }, date: new Date('2024-03-18') },
      {
        title: '시원한 옛날 블로그입니다.',
        content: 'Learn Docker',
        routine: { id: 20 },
        date: new Date('2024-03-17')
      },
      {
        title: '그저 그런 옛날 블로그입니다.',
        content: 'Learn Docker',
        routine: { id: 20 },
        date: new Date('2024-03-12')
      }
    ])
  }
}

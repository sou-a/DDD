import { prisma } from '@testUtil/prisma'
import { UserQS } from '../../query-service/user-qs'
import { TaskStatus } from 'src/domain/valueOblect/task-status'
import { UserStatus } from 'src/domain/valueOblect/user-status'
import { seedTaskGroup } from '@testUtil/task-group-factory'
import { seedAllTaskStatus } from '@testUtil/task-user-status-factory'

// TODO: 実装
describe('user-qs.ts', () => {
  const userQS = new UserQS(prisma)
  beforeAll(async () => {
    await prisma.pair.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('findUsersByTasks', () => {
    afterEach(async () => {
      await prisma.pair.deleteMany({})
    })
    it('[正常系]「特定の課題（複数可能）」が「特定の進捗ステータス」になっている参加者の一覧を、10人単位でページングして取得する', async () => {
      seedAllTaskStatus()
      seedTaskGroup({ id: '1' })

      const task = {
        id: '1',
        taskGroupId: '1',
        name: 'name',
      }
      await prisma.task.createMany({ data: task })

      for (let index = 1; index <= 10; index++) {
        const id = `${index}`
        const user = {
          id,
          name: `user${index}`,
          mailAddress: `${index}sample@example.com`,
          userStatusId: UserStatus.active,
        }
        await prisma.user.createMany({ data: user })

        const userBelongTaskExpected = {
          userId: id,
          taskId: '1',
          taskUserStatusId: '1',
        }
        await prisma.taskUser.createMany({ data: userBelongTaskExpected })
      }
      expect(
        await userQS.findUsersByTasks({
          taskIds: ['1'],
          taskStatus: TaskStatus.review,
          offset: 1,
        }),
      ).toHaveLength(10)
    })
  })
})

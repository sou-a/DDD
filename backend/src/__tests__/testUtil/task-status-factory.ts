import { prisma } from 'src/__tests__/testUtil/prisma'

export const seedAllTaskStatus = async () => {
  const data = [
    {
      id: '1',
      name: '未着手',
    },
    {
      id: '2',
      name: 'レビュー待ち',
    },
    {
      id: '3',
      name: '完了',
    },
  ]

  await prisma.taskUserStatus.createMany({
    data: data,
  })
}

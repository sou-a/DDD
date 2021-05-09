import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import { FindAllTaskResponse } from './response/task-response'
import { TaskUseCase } from 'src/app/task-usecase'
import { TaskRepository } from 'src/infra/db/repository/task-repository'
import { UserBelongTaskRepository } from 'src/infra/db/repository/user-belong-task-repository'
import {
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  UpdateTaskGroupRequest,
} from './request/task-request'

@Controller({
  path: '/tasks',
})
export class TaskController {
  @Get()
  @ApiResponse({ status: 200, type: FindAllTaskResponse })
  async findAllUser(): Promise<FindAllTaskResponse> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const usecase = new TaskUseCase(taskRepository, userBelongTaskRepository)
    const result = await usecase.findAll()
    const response = new FindAllTaskResponse({ taskDTOs: result })
    return response
  }

  @Post()
  async createUser(@Body() postTaskDto: CreateTaskRequest): Promise<void> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const usecase = new TaskUseCase(taskRepository, userBelongTaskRepository)
    await usecase.create({
      name: postTaskDto.name,
      taskGroupId: postTaskDto.taskGroupId,
    })
  }

  @Patch(':id')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() postTaskDto: UpdateTaskStatusRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const usecase = new TaskUseCase(taskRepository, userBelongTaskRepository)
    await usecase.changeStatus({
      taskId: id,
      userId: postTaskDto.userId,
      status: postTaskDto.status,
    })
  }

  @Patch(':id')
  async updateTaskGroup(
    @Param('id') id: string,
    @Body() postTaskDto: UpdateTaskGroupRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const usecase = new TaskUseCase(taskRepository, userBelongTaskRepository)
    await usecase.changeTaskGroup({
      taskId: id,
      taskGroupId: postTaskDto.taskGroupId,
    })
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const usecase = new TaskUseCase(taskRepository, userBelongTaskRepository)
    await usecase.delete({
      taskId: id,
    })
  }
}

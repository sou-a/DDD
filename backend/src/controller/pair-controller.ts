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
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { PairUseCase } from 'src/app/pair-usecase'
import { FindAllPairResponse } from './response/pair-response'
import { CreatePairRequest, PairUserRequest } from './request/pair-request'

@Controller({
  path: '/pairs',
})
export class PairController {
  @Get()
  @ApiResponse({ status: 200, type: FindAllPairResponse })
  async findAllUser(): Promise<FindAllPairResponse> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const pairRepository = new PairRepository(prisma)

    const usecase = new PairUseCase(pairRepository, userRepository)
    const result = await usecase.findAll()
    const response = new FindAllPairResponse({ pairDTOs: result })
    return response
  }

  @Post()
  async createPair(@Body() pairDto: CreatePairRequest): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const pairRepository = new PairRepository(prisma)

    const usecase = new PairUseCase(pairRepository, userRepository)
    await usecase.create({
      name: pairDto.name,
      userIds: pairDto.userIds,
    })
  }

  @Patch('add/:id')
  async addPairUser(
    @Param('id') id: string,
    @Body() pairDto: PairUserRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const pairRepository = new PairRepository(prisma)

    const usecase = new PairUseCase(pairRepository, userRepository)
    await usecase.addPairUser({
      pairId: id,
      userId: pairDto.userId,
    })
  }

  @Patch('remove/:id')
  async removePairUser(
    @Param('id') id: string,
    @Body() pairDto: PairUserRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const pairRepository = new PairRepository(prisma)

    const usecase = new PairUseCase(pairRepository, userRepository)
    await usecase.removePairUser({
      pairId: id,
      userId: pairDto.userId,
    })
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const pairRepository = new PairRepository(prisma)

    const usecase = new PairUseCase(pairRepository, userRepository)
    await usecase.delete({
      pairId: id,
    })
  }
}

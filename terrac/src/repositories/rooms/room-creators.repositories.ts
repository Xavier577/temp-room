import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomCreatorsRepositories {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(query: Prisma.RoomCreatorCreateArgs) {
    return this.prismaService.roomCreator.create(query);
  }

  public async find(query: Prisma.RoomCreatorFindFirstArgs) {
    return this.prismaService.roomCreator.findFirst(query);
  }

  public async update(query: Prisma.RoomCreatorUpdateArgs) {
    return this.prismaService.roomCreator.update(query);
  }

  public async delete(query: Prisma.RoomCreatorDeleteArgs) {
    return this.prismaService.roomCreator.delete(query);
  }
}

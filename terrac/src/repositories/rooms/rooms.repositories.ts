import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomsRepositories {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(query: Prisma.RoomCreateArgs) {
    return this.prismaService.room.create(query);
  }

  public async find(query: Prisma.RoomFindFirstArgs) {
    return this.prismaService.room.findFirst(query);
  }

  public async update(query: Prisma.RoomUpdateArgs) {
    return this.prismaService.room.update(query);
  }

  public async delete(query: Prisma.RoomDeleteArgs) {
    return this.prismaService.room.delete(query);
  }
}

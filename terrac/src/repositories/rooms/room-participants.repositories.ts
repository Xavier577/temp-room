import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomParticipantsRepositories {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(query: Prisma.RoomParticipantCreateArgs) {
    return this.prismaService.roomParticipant.create(query);
  }

  public async find(query: Prisma.RoomParticipantFindFirstArgs) {
    return this.prismaService.roomParticipant.findFirst(query);
  }

  public async findParticipantsInRoom(roomId: string) {
    return this.prismaService.roomParticipant.findMany({ where: { roomId } });
  }

  public async update(query: Prisma.RoomParticipantUpdateArgs) {
    return this.prismaService.roomParticipant.update(query);
  }

  public async delete(query: Prisma.RoomParticipantDeleteArgs) {
    return this.prismaService.roomParticipant.delete(query);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessagesRepositories {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(query: Prisma.MessageCreateArgs) {
    return this.prismaService.message.create(query);
  }

  public async find(query: Prisma.MessageFindFirstArgs) {
    return this.prismaService.message.findFirst(query);
  }

  public async update(query: Prisma.MessageUpdateArgs) {
    return this.prismaService.message.update(query);
  }

  public async delete(query: Prisma.MessageDeleteArgs) {
    return this.prismaService.message.delete(query);
  }
}

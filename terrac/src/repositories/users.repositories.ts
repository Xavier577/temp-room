import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepositories {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(query: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(query);
  }

  public async delete(query: Prisma.UserDeleteArgs) {
    return this.prismaService.user.delete(query);
  }

  public async update(query: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(query);
  }

  public async find(query: Prisma.UserFindFirstArgs) {
    return this.prismaService.user.findFirst(query);
  }

  public async findById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }
}

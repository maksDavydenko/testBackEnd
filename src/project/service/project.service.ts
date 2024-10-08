import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/schema.prisma';
import { Project, Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async findMany(params: Prisma.ProjectFindManyArgs): Promise<Project[]> {
    return this.prisma.project.findMany(params);
  }

  async findOne(params: Prisma.ProjectFindUniqueArgs): Promise<Project | null> {
    return this.prisma.project.findUnique(params);
  }

  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({
      data,
    });
  }

  async update(id: number, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }
}

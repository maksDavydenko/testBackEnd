import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProjectService } from '../service/project.service';

@Injectable()
export class ProjectJobService {
  constructor(private readonly projectService: ProjectService) {}

  @Cron('* * * * *')
  async handleExpiredProjects() {
    const now = new Date();

    const expiredProjects = await this.projectService.findMany({
      where: {
        expiredAt: {
          lt: now,
        },
        status: {
          not: 'expired',
        },
      },
    });

    for (const project of expiredProjects) {
      await this.projectService.update(project.id, {
        status: 'expired',
        updatedAt: new Date(),
      });
    }
  }
}

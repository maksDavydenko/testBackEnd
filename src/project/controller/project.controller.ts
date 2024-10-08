import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import {
  CreateProjectDto,
  UpdateProjectDto,
} from '../dto/project-list-response.dto';
import { Project } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async list(
    @Request() req,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ): Promise<{
    data: Project[];
    total: number;
    size: number;
    offset: number;
    limit: number;
  }> {
    const userId = req.user.sub as number;
    const limitNum = parseInt(limit, 10) || 10;
    const offsetNum = parseInt(offset, 10) || 0;
    const searchQuery = search ? search.trim() : '';

    const whereClause = {
      userId,
      deletedAt: null,
      ...(searchQuery && {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { url: { contains: searchQuery, mode: 'insensitive' } },
        ],
      }),
    };

    const total = await this.projectService.count({
      where: whereClause,
    });

    const projects = await this.projectService.findMany({
      where: whereClause,
      skip: offsetNum,
      take: limitNum,
      orderBy: { id: 'asc' },
    });

    return {
      data: projects,
      total: total,
      size: projects.length,
      offset: offsetNum,
      limit: limitNum,
    };
  }

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req,
  ): Promise<Project> {
    const userId = req.user.sub as number;

    return this.projectService.create({
      ...createProjectDto,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ): Promise<Project> {
    const userId = req.user.sub as number;

    const project = await this.projectService.findOne({
      where: { id: Number(id), userId, deletedAt: null },
    });

    if (!project) {
      throw new NotFoundException('Project not found or has been deleted');
    }

    return this.projectService.update(Number(id), {
      ...updateProjectDto,
      updatedAt: new Date(),
    });
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string, @Request() req): Promise<Project> {
    const userId = req.user.sub as number;

    const project = await this.projectService.findOne({
      where: { id: Number(id), userId, deletedAt: null },
    });

    if (!project) {
      throw new NotFoundException('Project not found or has been deleted');
    }

    return this.projectService.update(Number(id), {
      deletedAt: new Date(),
    });
  }
}

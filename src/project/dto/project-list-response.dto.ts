import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsDate()
  expiredAt?: Date;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from '../dto/project-list-response.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TaskStatus } from './task.model';
export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

import { Controller, Get } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  public findAll(): string[] {
    return ['Task 1', 'Task 2', 'Task 3'];
  }
}

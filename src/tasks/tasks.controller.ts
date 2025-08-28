import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
  Post,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exceptions';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  public findOne(@Param() params: FindOneParams): ITask {
    return this.findOneOrFail(params.id);
  }

  @Post()
  public create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  // @Patch('/:id/status')
  // public updateTaskStatus(
  //   @Param() params: FindOneParams,
  //   @Body() body: UpdateTaskStatusDto,
  // ): ITask {
  //   const task = this.findOneOrFail(params.id);
  //   task.status = body.status;

  //   return task;
  // }

  @Patch('/:id')
  public updateTask(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): ITask {
    const task = this.findOneOrFail(params.id);
    try {
      return this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException([error.message]);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteTask(@Param() params: FindOneParams): void {
    const task = this.findOneOrFail(params.id);
    this.tasksService.deleteTask(task);
  }
  private findOneOrFail(id: string): ITask {
    const task = this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }
}

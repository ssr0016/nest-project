import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { TaskStatus } from './task.model';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exceptions';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  public async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }

  public async findOne(id: string): Promise<Task | null> {
    return await this.tasksRepository.findOne({
      where: { id },
      relations: ['labels'],
    });
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    // await this.tasksRepository.create({
    //   ...createTaskDto,
    // });
    return await this.tasksRepository.save(createTaskDto);
  }

  public async updateTask(
    task: Task,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];

    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  public async deleteTask(task: Task): Promise<void> {
    await this.tasksRepository.delete(task);
  }
}

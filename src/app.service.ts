import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly dummyService: DummyService,
    private readonly loggerService: LoggerService,
  ) {}

  getHello(): string {
    return this.loggerService.log(`Hello world! ${this.dummyService.work()}`);
  }
}

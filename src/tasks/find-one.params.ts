import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class FindOneParams {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}

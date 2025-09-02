import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // hash()
  // plain text -> hashed text
  // for the same input -> the same output
  // 1234567 -> sadfasf123123sdf
  // ---------
  // bcrypt.has -> was called
  // -> password was passed to it & salt rounds
  // mocks & spy
  it('should hash password', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
    const password = 'password123';
    const result = await service.hash(password);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mockHash);
  });

  it('should correctly verify password', async () => {
    // 1) Mock bcrypt.compare()
    // 2) Mock the resolve value
    // 3) Call the service method - verify()
    // 4) bcrypt.compare() was called with specific arguments
    // 5) we verify if the service method returned what bcrypt compare() did
  });

  it('should fail on incorrect password', async () => {
    // 1) Mock bcrypt.compare() - fails!
    // 2) Mock the resolve value
    // 3) Call the service method - verify()
    // 4) bcrypt.compare() was called with specific arguments
    // 5) we verify if the service method returned what bcrypt compare() did
  });
});

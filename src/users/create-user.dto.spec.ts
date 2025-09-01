import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto = new CreateUserDto();

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.name = 'test';
    dto.password = '123456';
  });

  it('2+2=4', () => {
    expect(2).toBe(2); //Assertion
  });

  it('should validate complete valid data', async () => {
    // Arrange
    // Act
    const errors = await validate(dto);
    // Assert
    expect(errors.length).toBe(0);
  });

  it('should fail on invalid email', async () => {
    // Arrance
    dto.email = 'test';
    // Act
    const errors = await validate(dto);
    // Assert
    expect(errors.length).toBeGreaterThan(0);
    // console.log(errors);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });
});

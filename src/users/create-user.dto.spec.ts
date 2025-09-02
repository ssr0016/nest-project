import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto = new CreateUserDto();

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.name = 'test';
    dto.password = '123456A#';
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

  // 1) At least 1 uppercase letter
  // 2) At least 1 number
  // 3) Atleast 1 special character
  it('should return specific validation messages', async () => {
    dto.password = '123456';

    const errors = await validate(dto);

    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).not.toBeUndefined();
    const messages = Object.values(passwordError?.constraints ?? {});
    expect(messages).toContain('must contain at least 1 special character');
  });
});

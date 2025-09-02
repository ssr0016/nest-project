import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userService.createUser(createUserDto);

    // 1) Return the user
    // 2) Return the user & token
    // 3) Return the token

    return user;
  }
}

// 1) user registration
// - Make sure does not exist
// - Store the user
// - (optional) generate token
// 2) Generating token

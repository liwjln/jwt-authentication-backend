import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body) {
    const { email, password } = body;
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    await this.userService.registerUser(email, password);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(@Body() body) {
    const { email, password } = body;
    const token = await this.userService.validateUser(email, password);
    if (!token) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { message: 'Login successful', token };
  }

  @Get('profile') async getProfile(@Req() req) {
    try {
      const user = await this.userService.getUserById(req.user);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return { user };
    } catch (error) {
      throw new HttpException(
        'Error retrieving profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('profile') async updateProfile(@Req() req, @Body() body) {
    try {
      const updatedUser = await this.userService.updateUser(req.user, body);
      return { user: updatedUser };
    } catch (error) {
      throw new HttpException('Error updating profile', HttpStatus.BAD_REQUEST);
    }
  }
}

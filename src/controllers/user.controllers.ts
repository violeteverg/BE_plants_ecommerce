import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:email')
  async getProfile(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Put('profile')
  async updateProfile(@Body() updateUserDto: CreateUserDto) {
    return this.userService.update(updateUserDto);
  }
}

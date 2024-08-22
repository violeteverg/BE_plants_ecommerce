import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const userExist = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExist) {
      throw new ConflictException('Email already exists');
    }
    console.log(data);

    const passwordHashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: passwordHashed,
        createdAt: new Date(),
        updateAt: new Date(),
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async update(data: CreateUserDto) {
    return this.prisma.user.update({
      where: { email: data.email },
      data,
    });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: currentHashedRefreshToken },
    });
  }
}

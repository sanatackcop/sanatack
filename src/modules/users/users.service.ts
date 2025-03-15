import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SingupBody } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}
  async getUser({ email }: { email: string }): Promise<User> {
    const user = await this.userRepo.findOneBy({
      email: Equal(email),
    });

    if (!user) return null;
    return user;
  }

  async createUser({
    email,
    password,
    first_name,
    last_name,
    phone,
  }: SingupBody): Promise<User> {
    const newUser = this.userRepo.create({
      email,
      password,
      firstName: first_name,
      lastName: last_name,
      phone,
    });

    await this.userRepo.save(newUser);
    return newUser;
  }

  async turnActive({ user_id }: { user_id: string }) {
    const updateResult = await this.userRepo.update(
      { id: user_id },
      { isVerify: true }
    );
    if (updateResult.affected === 0) {
      throw new Error('User not found or update failed');
    }
    return true;
  }
}

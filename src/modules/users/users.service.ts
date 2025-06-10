import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import User from './entities/user.entity';
import { PersonalInfoDto } from '../auth/dto/auth.dto';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  getUser({ email }: { email: string }): Promise<User> {
    return this.userRepo.findOneBy({
      email: Equal(email),
    });
  }

  createUser(personalInfo: PersonalInfoDto) {
    return this.userRepo.save(
      this.userRepo.create({
        email: personalInfo.email,
        password: personalInfo.password,
        phone: personalInfo.phone,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        isActive: true,
        //! update later to approate place
        isVerify: true,
      })
    );
  }

  async findOne(id: string) {
    return this.userRepo.findOne({
      where: { id: Equal(id) },
    });
  }
}

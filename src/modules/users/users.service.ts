import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import User from './entities/user.entity';
import { PersonalInfoDto } from '../auth/dto/auth.dto';
import { UpdateProfileDto } from './entities/user.dto';
import UsersAttributes from './entities/user.attributes.entity';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UsersAttributes)
    private readonly userAttributesRepo: Repository<UsersAttributes>
  ) {}

  getUser({ email }: { email: string }): Promise<User> {
    return this.userRepo.findOneBy({
      email: Equal(email),
    });
  }

  getUserProfile(id: string): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['attributes'],
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

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.userRepo.update(
      { id: userId },
      {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.phone && { phone: dto.phone }),
      }
    );

    await this.userAttributesRepo.update(
      { user: { id: userId } },
      {
        ...(dto.bio && { bio: dto.bio }),
        ...(dto.organization && { organization: dto.organization }),
      }
    );
  }
}

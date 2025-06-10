import { DeepPartial, Repository } from 'typeorm';
import UsersAttributes from './entities/user.attributes.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class UsersAttributesService {
  constructor(
    @InjectRepository(UsersAttributes)
    private readonly usersAttributes: Repository<UsersAttributes>
  ) {}

  create(attribute: DeepPartial<UsersAttributes>) {
    return this.usersAttributes.save(
      this.usersAttributes.create({
        ...attribute,
        user: { id: attribute.user.id },
      })
    );
  }
}

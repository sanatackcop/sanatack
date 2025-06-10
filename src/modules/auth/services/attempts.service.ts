import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attempts } from '../entities/attempts.entity';

@Injectable()
export default class AttemptsService {
  constructor(
    @InjectRepository(Attempts)
    private attemptsRepository: Repository<Attempts>
  ) {}

  createFailedAttempt(email: string, code: string): Promise<Attempts> {
    return this.createAttempt(email, code, 'failed');
  }

  createSuccessAttempt(email: string, code: string) {
    return this.createAttempt(email, code, 'success');
  }

  private createAttempt(
    email: string,
    code: string,
    status: 'failed' | 'success'
  ) {
    return this.attemptsRepository.save(
      this.attemptsRepository.create({
        email,
        code,
        status,
      })
    );
  }
}

import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Worker, Job } from 'bullmq';

@Injectable()
export class OtpProcessor implements OnModuleInit, OnModuleDestroy {
  private worker: Worker;
  private readonly logger = new Logger(OtpProcessor.name);

  onModuleInit() {
    this.worker = new Worker(
      'otpQueue',
      async (job: Job) => {
        if (job.name === 'sendEmailJob') {
          await this.handleSendEmail(job);
        }
      },
      {
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6379,
        },
      }
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed.`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job.id} failed: ${err.message}`, err.stack);
    });
  }

  async handleSendEmail(
    job: Job<{ user_id: string; email: string; otp: string }>
  ) {
    this.logger.log(
      `Sending OTP email to ${job.data.email} with OTP ${job.data.otp}`
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log(`Email sent to ${job.data.email}`);
  }

  async onModuleDestroy() {
    await this.worker.close();
  }
}

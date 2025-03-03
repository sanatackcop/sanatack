import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateOAuthLogin(profile: any): Promise<any> {
    // Implement your logic to validate and handle the OAuth login
    return profile;
  }
}

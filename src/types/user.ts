export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  organization?: string;
}

export interface UserProfileDto{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isVerify: boolean;
  plan_type: string;
  phone?: string;
  attributes?: {
    topics: string[];
    userType: string;
    bio?: string;
    organization?: string;
  };
  created_at: string;
}

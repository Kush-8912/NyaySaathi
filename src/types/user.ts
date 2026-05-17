export type UserType =
  | 'Student'
  | 'Employee'
  | 'Freelancer'
  | 'Founder'
  | 'Tenant'
  | 'Business Owner'
  | 'Other';

export type PreferredLanguage = 'English' | 'Simple English' | 'Hinglish';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  bio?: string;
  city?: string;
  state?: string;
  userType?: UserType;
  preferredLanguage?: PreferredLanguage;
  createdAt: Date | string;
  updatedAt: Date | string;
}

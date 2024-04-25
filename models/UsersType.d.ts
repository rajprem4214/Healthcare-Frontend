declare interface User {
  id: string;
  fullName: string;
  healthId: string | null;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  roles: UserRole;
  projectId: string;
  active: boolean;
  admin: boolean;
  updatedAt: Date | null;
  createdAt: Date | null;
  patientId: string;
}

declare type UserRole = 'Patient' | 'Practitioner' | 'RelatedPerson';

declare interface UserStoreDetails {
  user: User;
  accessToken: string;
  refreshToken: string;
}

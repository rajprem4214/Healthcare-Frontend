declare type PatientsListResponse = {
  count: number;
  limit: number;
  page: number;
  data: Patient[];
};

declare type Patient = {
  id: string;
  fullName: string;
  healthId: string | null;
  email: string | null;
  emailVerified: 1 | 0;
  phoneNumber: string | null;
  roles: UserRole.Patient;
  projectId: string | null;
  active: 1 | 0;
  admin: 0 | 1;
  updatedAt: string;
  createdAt: string;
};

export interface User {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  roleId: number;
  role: Role;
  isActive: boolean;
  createdAt: Date;
}

export interface Role {
  roleId: number;
  roleName: string;
  description?: string;
}

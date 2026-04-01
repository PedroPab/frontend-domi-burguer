export interface UserProfile {
  id: string;
  idAuth: string;
  name: string;
  email: string;
  roles: string[];
  photoUrl: string;
  phone: string;
  pointsBalance: number;
  createdAt: string;
  updatedAt: string;
  assignedKitchens?: string[];
}

export interface RSVPFormData {
  id: string;
  tower: string;
  wing: string;
  floor: string;
  flatNumber: string;
  fullFlatNumber: string;
  email: string;
  attendance: 'yes' | 'undecided' | 'no';
  submittedAt: string;
}

export interface FormErrors {
  tower?: string;
  wing?: string;
  floor?: string;
  flatNumber?: string;
  email?: string;
  attendance?: string;
}

export interface AdminAuth {
  isAuthenticated: boolean;
  password: string;
}
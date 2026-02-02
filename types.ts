
export type TrainingType = 'Internship' | 'Project';
export type IOMOption = 'IOM to AC CISF' | 'IOM to safety dept' | 'IOM to respective dept';

export interface InternshipApplication {
  id: string; // Generated unique 6 char alphanumeric (Gate Pass ID)
  applicationNo: string; // Unique 5-6 digit alphanumeric application number
  groupId: string; // Linking ID for group registrations
  studentName: string;
  age: string;
  dob: string;
  identificationMark: string;
  course: string;
  specialization: string;
  collegeName: string;
  days: number;
  fromDate: string;
  toDate: string;
  deptIPT: string;
  trainingType: TrainingType;
  passNo: string;
  gender: 'Male' | 'Female' | 'Other';
  fatherName: string;
  year: string;
  mobileNo: string;
  emergencyNo: string;
  collegeAddress: string;
  residentialAddress: string;
  amount: string;
  ddNumber: string;
  ddDate: string;
  ddBank: string;
  paymentDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  spnoEmployee: string;
  paymentMethod: string;
  category: string;
  signatureByName: string;
  iomTraining: IOMOption;
  referralNo: string;
  referralDesignation: string;
  referralPersonContact: string;
  referralDepartment: string;
  createdAt: string; // ISO string of submission date
  // New fields for Undertaking
  letterNo: string;
  letterDate: string;
  // Support for digital document storage (base64 strings)
  documents?: {
    [key: string]: string; 
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
}

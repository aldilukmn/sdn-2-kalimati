export interface Address {
  street?: string;
  rt?: string;
  rw?: string;
  village?: string;
  district?: string;
  postalCode?: string;
}

export interface Parent {
  name?: string;
  birthYear?: string;
  occupation?: string;
  education?: string;
  monthlyIncome?: string;
  nik?: string;
}

export interface Guardian {
  name?: string;
  relationship?: string;
  phoneNumber?: string;
}

export interface Student {
  address?: Address;
  fullName?: string;
  nik?: string;
  nisn?: string;
  noKk?: string;
  birthPlace?: string;
  birthDate?: Date;
  gender?: string;
  religion?: string;
  childOrder?: string;
  kindergartenOrigin?: string;
  numberOfSiblings?: string;
}

export interface Registrant {
  _id?: string;
  id?: string;
  student?: Student;
  father?: Parent;
  mother?: Parent;
  guardian?: Guardian;
  registrationNumber?: string;
  status?: string;
  contactPhoneNumber?: string;
  hasGuardian?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegistrationForm {
  student: {
    fullName: string;
    nisn: string;
    nik: string;
    noKk: string;
    birthPlace: string;
    birthDate: string;
    gender: string;
    religion: string;
    address: {
      street: string;
      rt: string;
      rw: string;
      village: string;
      district: string;
      postalCode: string;
    };
    childOrder: string;
    numberOfSiblings: string;
    kindergartenOrigin: string;
  };
  contactPhoneNumber: string;
  father: {
    name: string;
    birthYear: string;
    occupation: string;
    education: string;
    monthlyIncome: string;
    nik: string;
  };
  mother: {
    name: string;
    birthYear: string;
    occupation: string;
    education: string;
    monthlyIncome: string;
    nik: string;
  };
  hasGuardian: boolean;
  guardian: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
}

export interface PaginatedRegistrants {
  data: Registrant[];
  total: number;
  totalPages: number;
  totalValidated: number;
  totalUnvalidated: number;
}

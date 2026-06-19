interface RegistrationForm {
  // Data Calon Peserta Didik
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
    }
    childOrder: string;
    numberOfSiblings: string;
    kindergartenOrigin: string;
  };
  contactPhoneNumber: string;

  // Data Ayah
  father: {
    name: string;
    birthYear: string;
    occupation: string;
    education: string;
    monthlyIncome: string;
    nik: string;
  }

  // Data Ibu
  mother: {
      name: string;
      birthYear: string;
      occupation: string;
      education: string;
      monthlyIncome: string;
      nik: string;
    }

  // Data Wali
  hasGuardian: boolean;
  guardian: {
    name: string;
    relationship: string;
    phoneNumber: string;
    }
}
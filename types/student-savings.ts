export interface StudentSavingsStudent {
  _id: string;
  studentId: string;
  name: string;
  grade: string;
  balance: number;
  todayDeposit?: number;
}

export interface SavingsSummary {
  totalStudents: number;
  dailyDeposits: number;
  dailyWithdrawals: number;
}

export interface MonthlyRecap {
  totalBalance: number;
  totalStudents: number;
  monthlyDeposits: number;
  monthlyWithdrawals: number;
}

export interface MonthlyBreakdownItem {
  studentId: string;
  name: string;
  grade: string;
  months: Record<string, number>;
  balance: number;
  totalWithdrawn: number;
}

export interface Transaction {
  _id: string;
  studentId: string;
  name: string;
  grade: string;
  date: string;
  type: "simpan" | "tarik";
  amount: number;
  description?: string;
  recordedBy: string;
  createdAt: string;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GradeRecap {
  grade: string;
  totalStudents: number;
  deposits: number;
  withdrawals: number;
  totalBalance: number;
}

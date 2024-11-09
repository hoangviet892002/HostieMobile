export interface Bank {
  id: number;
  enName: string;
  vnName: string;
  bankId: string;
  atmBin: string;
  cardLength: number;
  shortName: string;
  bankCode: string;
}

export interface BankAccountsType {
  id: number;
  createdAt: number;
  updatedAt: number;
  accountNo: string;
  bank: Bank;
  accountHolder: string;
  status: string;
}

export interface BankAccountsType {
  id: number;
  createdAt: number;
  updatedAt: number;
  accountNo: string;
  bank: {
    id: number;
    enName: string;
    vnName: string;
    bankId: string;
    atmBin: string;
    cardLength: number;
    shortName: string;
    bankCode: string;
  };
  accountHolder: string;
  status: string;
}

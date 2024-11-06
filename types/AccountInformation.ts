interface phone {
  id: number;
  phone: string;
  status: number;
}
interface bankAccounts {
  accountNo: string;
  bankName: string;
  bankId: number;
  accountHolder: string;
  status: number;
}
interface socials {
  socialName: string;
  url: string;
  status: number;
}
export interface AccountInformation {
  email: string;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  point: number;
  phones: phone[];
  bankAccounts: bankAccounts[];
  socials: socials[];
  urlAvatar: string;
}

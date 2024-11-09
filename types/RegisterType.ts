export interface RegisterType {
  packageInfo: {
    id: number;
    createdAt: number;
    updatedAt: number;
    name: string;
    description: string;
    duration: number;
    price: number;
    status: number;
    roleId: number;
  };
  packagePrice: number;
  totalAmount: number;
  expireAt: number[];
  duration: number;
  paymentCode: number;
  upgradeFrom: null | number;
  oldPackageDaysLeft: null | number;
  changeAmount: null | number;
  status: number;
  paymentExpiryTime: null | number[];
  active: boolean;
  registerStatus: string;
}

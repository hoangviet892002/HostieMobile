interface PackageType {
  id: number;
  createdAt: number;
  updatedAt: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  status: number;
  roleId: number;
}
export interface UpgradePackageType {
  newPackage: PackageType;
  upgradeCost: number;
}
export default PackageType;

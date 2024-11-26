interface approvedResidences {
  residenceId: number;
  housekeeperResidenceId: number;
  name: string;
  address: string | null;
}

export interface HouseKepperType {
  id: number;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  urlAvatar: string | null;
  approvedResidences: approvedResidences[];
}

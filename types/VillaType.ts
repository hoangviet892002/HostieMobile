import { CategoryType } from "./CategoryType";

export interface VillaType {
  id: string;
  name: string;
  thumbnail: string;
  maximumGuests: number;
  standardGuests: number;
  location: string;
  type: string;
  category: CategoryType[];
}

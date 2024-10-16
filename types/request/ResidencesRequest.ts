export interface ResidencesStep1 {
  id?: string;
  step: number;
  name: string;
  num_bath_room: number;
  num_bed_room: number;
  num_of_beds: number;
  max_guests: number;
  type: number;
}
export interface ResidencesStep2 {
  step: number;
  id: string;
  province_code: string;
  district_code: string;
  ward_code: string;
  address: string;
  phones: string[];
}

interface amenities {
  name: string;
  description: string;
  amenity_id: number;
}
export interface ResidencesStep3 {
  step: number;
  id: string;
  amenities: amenities[];
}
export interface ResidencesStep4 {
  step: number;
  id: string;
  price_default: number;
  price_weekend: { day: number; price: number }[];
  price_weeknd_delete: number[];
  price_special: { day: string; price: number }[];
  price_special_delete: number[];
  price_season: { start_date: string; end_date: string; price: number }[];
  price_season_delete: number[];
}
export interface ResidencesStep5 {
  step: number;
  id: string;
  files: File[];
}
export type ResidencesRequest =
  | ResidencesStep1
  | ResidencesStep2
  | ResidencesStep3
  | ResidencesStep4
  | ResidencesStep5;

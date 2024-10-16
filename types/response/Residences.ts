export interface Residence {
  residence_id: string;
  residence_name: string;
  residence_type: string;
  residence_type_id: string;
  residence_address: string;
  province: string;
  district: string;
  ward: string;
  status: string;
  images: { id: string; image: string }[];
}

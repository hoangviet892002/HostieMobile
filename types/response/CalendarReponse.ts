import { Calendar } from "../Calendar";

export interface CalendarResponse {
  calendars: [
    {
      id: number;
      name: string;
      host_id: number;
      host_username: string;
      residence_type_id: number;
      residence_type_name: string;
      calendar: Calendar[];
    }
  ];
}

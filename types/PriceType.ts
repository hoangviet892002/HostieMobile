export interface PriceWeekendType {
  weekendPrice: number;
  name: string;
  description: string;
}
export interface PriceHolidayType {
  holidayPrice: number;
  name: string;
  description: string;
}
export interface PriceSeasonType {
  startDate: Date;
  endDate: Date;
  seasonPrice: number;
  description: string;
}

export interface PriceType {
  defaultPrice: number;
  priceWeekend: PriceWeekendType[];
  priceHoliday: PriceHolidayType[];
  priceSeason: PriceSeasonType[];
}

import { Days, Months } from "@/constants/Calendar";

export const parseDate = (date: string) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const dayName = Days[dateObj.getDay()];
  const monthName = Months[dateObj.getMonth()];
  return dayName + ", " + day + " " + monthName + " " + year;
};

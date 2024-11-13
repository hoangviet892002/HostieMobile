import { Days, Months } from "@/constants/Calendar";

export const parseDate = (date: string) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const dayName = Days[dateObj.getDay()];
  const monthName = Months[dateObj.getMonth()];
  return dayName + ", " + day + " " + monthName + " " + year;
};

//  parse format date DD-MM-YYYY
export const parseDateDDMMYYYY = (date: string) => {
  const ddmmyyyyRegex = /^\d{2}-\d{2}-\d{4}$/;
  if (ddmmyyyyRegex.test(date)) {
    return date;
  }

  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};
export const parseDateString = (dateString: string) => {
  if (!dateString) return undefined;
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};
export const formatExpireDate = (dateArray: number[]) => {
  const [year, month, day, hour, minute] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString(undefined, options);
};

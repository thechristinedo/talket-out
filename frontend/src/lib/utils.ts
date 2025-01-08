// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

export const formatDateStamp = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatTimeStamp = (date: Date) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const isSameDay = (date1: Date, date2: Date) => {
  return date1.toDateString() === date2.toDateString();
};

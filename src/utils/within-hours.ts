export const withinHours = (hour: number): Date =>
  new Date(new Date().getTime() - 1000 * 60 * 60 * hour);

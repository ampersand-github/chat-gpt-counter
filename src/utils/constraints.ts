export const dbName = "gpt-history-db";
export const dbVersion = 1;
export const objectStorageName = "history-store";
export const indexName = "timestamp";
export const capHour = 3;
export const upperLimitPerCapHour = 25;
export const isPCSize = (): boolean => window.innerWidth >= 769;

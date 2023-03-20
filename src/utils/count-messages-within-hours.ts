import { withinHours } from "./within-hours";

export const countMessagesWithinHours = async (
  hour: number,
  index: IDBIndex
): Promise<number> => {
  const range = IDBKeyRange.lowerBound(withinHours(hour), true);
  let count = 0;

  return new Promise<number>((resolve, reject) => {
    const request = index.openCursor(range);
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        const record = cursor.value;
        if (record.isGPT4) count++;
        cursor.continue();
      } else {
        resolve(count);
      }
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

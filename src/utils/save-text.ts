export const saveText = async (
  text: string,
  db: IDBDatabase,
  isGPT4: boolean,
  objectStorageName: string
): Promise<IDBValidKey> => {
  const transaction = db.transaction(objectStorageName, "readwrite");
  const objectStore = transaction.objectStore(objectStorageName);

  return new Promise((resolve, reject) => {
    const request = objectStore.add({ text, timestamp: new Date(), isGPT4 });

    transaction.oncomplete = () => {
      console.log("Transaction completed successfully.");
      resolve(request.result);
    };

    transaction.onerror = () => {
      console.error("Transaction failed:", transaction.error);
      reject(transaction.error);
    };
  });
};

export const initDb = async (
  dbName: string,
  dbVersion: number,
  objectStorageName: string,
  indexName: string
) => {
  const openRequest = indexedDB.open(dbName, dbVersion);

  return new Promise<IDBDatabase>((resolve, reject) => {
    openRequest.onsuccess = () => {
      console.log("Success to open database");
      resolve(openRequest.result);
    };

    openRequest.onerror = () => {
      console.error("Failed to open database");
      reject();
    };

    openRequest.onupgradeneeded = (event) => {
      console.log("onupgradeneeded");
      const db = (event.target as IDBOpenDBRequest).result;
      const objectStore = db.createObjectStore(objectStorageName, {
        keyPath: "id",
        autoIncrement: true,
      });
      objectStore.createIndex(indexName, indexName);
    };
  });
};

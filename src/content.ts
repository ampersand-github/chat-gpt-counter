import { countMessagesWithinHours } from "./utils/count-messages-within-hours";
import { insertPElementIfNeed } from "./utils/insert-p-element-if-needed";
import { saveText } from "./utils/save-text";
import { isUrlIncludeGpt4 } from "./utils/is-url-include-gpt4";
import { initDb } from "./utils/init-db";
import {
  capHour,
  dbName,
  dbVersion,
  indexName,
  objectStorageName,
  upperLimitPerCapHour,
} from "./utils/constraints";

const main = async () => {
  const db = await initDb(dbName, dbVersion, objectStorageName, indexName);

  const textArea = document.querySelector(
    "main form textarea"
  ) as HTMLTextAreaElement;
  const form = document.querySelector("form") as HTMLFormElement;

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (textArea && textArea.value.length === 0) return;

      // submitした入力値をDBへ保存
      await saveText(textArea.value, db, isUrlIncludeGpt4(), objectStorageName);

      // GPT4の残り回数を取得
      const index: IDBIndex = db
        .transaction(objectStorageName, "readonly")
        .objectStore(objectStorageName)
        .index(indexName);
      const count = await countMessagesWithinHours(capHour, index);

      // 残り回数を画面に表示
      const message = `In GPT-4, You sent ${count} messages within three hours.<br> You can send ${
        upperLimitPerCapHour - count
      } more messages.`;
      insertPElementIfNeed(".gpt-counter", form, message);
    });
  }
};

main();

export {};

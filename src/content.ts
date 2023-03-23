import { insertPElementIfNeed } from "./utils/insert-p-element-if-needed";
import { isUrlIncludeGpt4 } from "./utils/is-url-include-gpt4";
import { isPCSize } from "./utils/constraints";
import { createDisplayMessage } from "./utils/create-display-message";
import { db } from "./db/db";
import { withinHours } from "./utils/within-hours";
import { enterKey } from "./utils/enter-key";
import Swal from "sweetalert2";

let isComposing = false;

const handleSubmit = async (message: string): Promise<void> => {
  await db.messages.add({
    message: message,
    isGPT4: isUrlIncludeGpt4(),
    postAt: new Date(),
  });

  const count = await db.messages
    .where("postAt")
    .between(withinHours(3), new Date())
    .filter((x) => x.isGPT4)
    .count();

  const m = createDisplayMessage(count + 1);
  insertPElementIfNeed(m);
};

const onEnterKey = async (event: KeyboardEvent): Promise<void> => {
  // PCサイズ未満の場合エンターキー入力が改行になるため、この処理が不要になる
  if (enterKey(event) && isPCSize()) {
    const textArea = event.target as HTMLTextAreaElement;

    // 処理しないパターン
    if (enterKey(event) && event.shiftKey) return; // 改行処理なのでスルー
    if (enterKey(event) && isComposing) return; // 日本語確定処理なのでスルー
    if (textArea.value.length === 0) return; // 0文字なのでスルー
    // ボタンが処理中で送信できない場合はスルー
    const formElement = textArea.closest("form") as HTMLFormElement;
    const buttonElements = formElement.querySelectorAll("button");
    const isDisabled = Array.from(buttonElements).some((button) => button.disabled);
    if (isDisabled) return;

    // 処理
    await handleSubmit(textArea.value);
  }
};

const attachSubmitListenerToForms = (): void => {
  const form = document.querySelector("form") as HTMLFormElement;
  form.addEventListener("submit", async (event: SubmitEvent) => {
    const message = (event.target as HTMLFormElement).querySelector("textarea")?.value;
    if (message) await handleSubmit(message);
  });
};

const attachEnterKeyListenerToInputs = (): void => {
  const input = document.querySelector("form textarea") as HTMLTextAreaElement;
  input.addEventListener("keydown", onEnterKey);
  input.addEventListener("compositionstart", () => (isComposing = true));
  input.addEventListener("compositionend", () => (isComposing = false));
};

const attachSidebarToggleListener = (): void => {
  const span = document.getElementsByClassName("sr-only");
  const sidebarToggle = span.length > 0 && span[0].closest("button");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      // サイドバーが開いていることを確認
      setTimeout(() => {
        const navElement = document.querySelector("nav");
        if (navElement) appendHistoryButton();
      }, 100);
    });
  }
};

const appendHistoryButton = (): void => {
  const navElement = document.querySelector("nav");
  if (navElement) {
    // 新しい要素を作成します。
    const newElement = document.createElement("a");
    newElement.textContent = "Show History";

    // nav要素の最後に新しい要素を追加します。
    navElement.appendChild(newElement);

    // 新しい要素に、既存の要素と同じクラス名を追加します。
    const navLinks = navElement.querySelectorAll("a");
    const linkClasses = navLinks[0].className.split(" ");

    for (let i = 0; i < linkClasses.length; i++) {
      newElement.classList.add(linkClasses[i]);
    }
    newElement.addEventListener("click", async () => {
      const getAll = await db.messages.limit(100).reverse().toArray();
      const element = document.createElement("ol");
      element.style.display = "table";
      element.style.textAlign = "left";
      getAll.forEach((one) => {
        const listItem = document.createElement("li");
        listItem.style.padding = "16px";
        listItem.textContent = one.message;
        element.appendChild(listItem);
        element.appendChild(document.createElement("hr"));
      });

      await Swal.fire({
        title: "History",
        html: element,
        confirmButtonText: "close",
        width: window.innerWidth * 0.8,
      });
    });
  }
};

const initListeners = (): void => {
  attachSubmitListenerToForms();
  attachEnterKeyListenerToInputs();
  attachSidebarToggleListener();
  appendHistoryButton();
};

// DOMがロードされたら、リスナーをアタッチ
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", initListeners)
  : initListeners();

/*
確認
  前提：
    devtoolを閉じていること
  タスク：
    PCサイズ：
      空白、ボタン押下でなにも発生しないこと
      文字ありでボタンを押下したとき、処理が走ること
      shift + enterで改行の上、何も発生しないこと
      日本語入力確定のとき、何も発生しないこと
      処理中のとき、エンターを押しても何も発生しないこと
      エンターを押したとき、処理が走ること
    タブレットサイズ：
      空白、ボタン押下でなにも発生しないこと
      文字ありでボタンを押下したとき、処理が走ること
      エンターキーを押しても改行のみで実行されないこと
   */

export {};

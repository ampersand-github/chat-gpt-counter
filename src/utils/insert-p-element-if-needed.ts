export const insertPElementIfNeed = (
  selector: string,
  form: HTMLFormElement,
  message: string
) => {
  let pElement = document.querySelector(selector);
  if (!pElement) {
    pElement = document.createElement("p");
    pElement.classList.add("gpt-counter");
    (pElement as HTMLElement).style.textAlign = "center";
    (pElement as HTMLElement).style.padding = "16px";
    form.before(pElement);
  }
  pElement.innerHTML = message;
};

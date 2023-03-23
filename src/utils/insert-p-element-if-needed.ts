export const insertPElementIfNeed = (message: string) => {
  const selector = "gpt-counter";
  const pElement = document.querySelector(`p.${selector}`);

  if (pElement) {
    pElement.innerHTML = message;
  } else {
    const p = createPElement(selector);
    const form = document.querySelector("form");
    form?.before(p);
    p.innerHTML = message;
  }
};

const createPElement = (selector: string): HTMLParagraphElement => {
  const pElement = document.createElement("p");
  pElement.classList.add(selector);
  pElement.style.textAlign = "center";
  pElement.style.padding = "8px";
  pElement.style.opacity = "60%";
  return pElement;
};

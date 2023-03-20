export const isUrlIncludeGpt4 = (): boolean => {
  let currentURL = window.location.href;
  return currentURL.includes("gpt-4");
};

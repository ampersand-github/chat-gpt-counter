export const isUrlIncludeGpt4 = (): boolean => {
  const currentURL = window.location.href;
  return currentURL.includes("gpt-4");
};

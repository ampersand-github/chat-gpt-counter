import { upperLimitPerCapHour } from "./constraints";

export const createDisplayMessage = (count: number): string =>
  `In GPT-4, You sent ${count} messages within three hours.<br> You can send ${
    upperLimitPerCapHour - count
  } more messages.`;

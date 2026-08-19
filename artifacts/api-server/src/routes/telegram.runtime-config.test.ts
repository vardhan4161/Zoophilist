import { describe, expect, it } from "vitest";

const telegramApiBase = "https://api.telegram.org";

async function callTelegram(method: "getMe" | "getChat", parameters?: URLSearchParams) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  expect(token).toMatch(/^\d+:[A-Za-z0-9_-]{30,}$/);
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required for runtime validation");

  const url = new URL(`/bot${token}/${method}`, telegramApiBase);
  parameters?.forEach((value, key) => url.searchParams.set(key, value));
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  expect(response.ok).toBe(true);

  const body = (await response.json()) as { ok?: boolean };
  expect(body.ok).toBe(true);
}

describe("configured Telegram alerts", () => {
  it("validates the bot and its private alert destination without sending a message", async () => {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    expect(chatId).toMatch(/^-100\d{6,}$/);
    if (!chatId) throw new Error("TELEGRAM_CHAT_ID is required for runtime validation");

    await callTelegram("getMe");
    await callTelegram("getChat", new URLSearchParams({ chat_id: chatId }));
  }, 20_000);
});

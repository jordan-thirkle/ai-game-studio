import { test, expect } from "@playwright/test";

const games = ["sky-drifter", "hollow-harvest", "whisperwood-v2"];

test.describe("live studio game catalogue", () => {
  test("catalogue exposes all playable game pages", async ({ page }) => {
    await page.goto("/games");
    await expect(page).toHaveTitle(/Games/i);
    for (const slug of games) {
      await expect(page.locator(`a[href="/games/${slug}"]`)).toBeVisible();
    }
  });

  for (const slug of games) {
    test(`${slug} has internal detail and play routes`, async ({ page }) => {
      await page.goto(`/games/${slug}`);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.getByRole("link", { name: /play in browser/i })).toHaveAttribute("href", `/games/${slug}/play`);
      await expect(page.locator("iframe")).toHaveAttribute("src", `/games/${slug}/index.html`);

      await page.goto(`/games/${slug}/play`);
      await expect(page.locator("iframe")).toHaveAttribute("src", `/games/${slug}/index.html`);
    });
  }
});

import { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForUrl(pattern: string | RegExp) {
    await this.page.waitForURL(pattern);
  }

  async getTitle() {
    return this.page.title();
  }
}

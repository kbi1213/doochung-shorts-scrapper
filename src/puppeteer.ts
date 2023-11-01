import puppeteer, { Browser, Page } from "puppeteer";

async function delay(milisecond = 2000) {
  return new Promise((resolve) => setTimeout(resolve, milisecond));
}

export async function initPuppeteer() {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
    headless: "new",
  });
  const page = await browser.newPage();

  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36";

  await page.setUserAgent(userAgent);

  return { browser, page };
}

export async function startScrapping({
  browser,
  page,
  url,
}: {
  browser: Browser;
  page: Page;
  url: string | undefined;
}) {
  try {
    // Navigate the page to a URL
    if (!url) throw Error("크롤링할 URL 주소를 확인해주세요.");

    await page.goto(url);

    // Scroll on to Last
    await page.keyboard.down("End");

    await delay(2000);

    const shortsObject = await page.$$eval(
      "a#thumbnail",
      (el: HTMLAnchorElement[]) => {
        return Array.from(el)
          .map((thumbnail) => thumbnail.href)
          .filter((truthy) => truthy)
          .map((href) => ({
            shortsId: href.split("/").pop()!,
            hospital: "doochung",
          }));
      }
    );
    return shortsObject;
  } catch (error) {
  } finally {
    await browser.close();
  }
}

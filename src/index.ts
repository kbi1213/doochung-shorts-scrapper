import env from "dotenv";
import { initPuppeteer, startScrapping } from "./puppeteer";
import { startGoogleSheet } from "./gsheet";

env.config();

(async function () {
  const { page, browser } = await initPuppeteer();

  const data = await startScrapping({
    page,
    browser,
    url: process.env.YOUTUBE_URL,
  });

  if (!data) {
    console.log("추가된 데이터가 없습니다.");
    return;
  }

  const doc = await startGoogleSheet(process.env.GOOGLE_SHEET_ID);

  await doc.loadInfo();

  const sheet = await doc.sheetsByIndex[0]; // 첫번째 시트
  const rows = await sheet.getRows();

  // 기존 Row 순회하여 data 값과 비교
  const newData = data.filter(
    (video) => !rows.some((row) => row.get("shortsId") === video.shortsId)
  );

  await sheet.addRows(newData);

  console.log("실행 완료되었습니다. 추가된 데이터 \n", newData);
})();

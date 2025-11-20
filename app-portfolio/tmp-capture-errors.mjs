import { chromium } from "playwright"

const base = "http://127.0.0.1:5174"
const targets = [
  `${base}/os`,
  `${base}/study-materials`,
  `${base}/timetable`,
]

const browser = await chromium.launch()
try {
  for (const url of targets) {
    const page = await browser.newPage()
    page.on("console", (msg) => {
      console.log(`[${url}] console.${msg.type()} -> ${msg.text()}`)
    })
    page.on("pageerror", (error) => {
      console.log(`[${url}] pageerror -> ${error.stack}`)
    })
    console.log(`Visiting ${url}`)
    await page.goto(url, { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(2000)
    await page.close()
  }
} finally {
  await browser.close()
}

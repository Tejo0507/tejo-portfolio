import { chromium } from "playwright"
import { spawn } from "node:child_process"
import process from "node:process"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const cwd = dirname(fileURLToPath(import.meta.url))

function startDevServer() {
  return new Promise((resolve, reject) => {
    const dev = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4173"], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
    })

    const onData = (chunk) => {
      const text = chunk.toString()
      process.stdout.write(text)
      if (text.includes("Local:")) {
        dev.stdout.off("data", onData)
        resolve(dev)
      }
    }

    dev.stdout.on("data", onData)
    dev.stderr.on("data", (chunk) => {
      process.stderr.write(chunk)
    })
    dev.on("error", reject)
  })
}

async function checkPage(url) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  page.on("console", (msg) => {
    console.log(`[console:${msg.type()}]`, msg.text())
  })
  page.on("pageerror", (err) => {
    console.error(`[pageerror] ${err.name}: ${err.message}`)
  })
  console.log(`\nVisiting ${url}`)
  await page.goto(url, { waitUntil: "networkidle" })
  await page.waitForTimeout(2000)
  await browser.close()
}

let devServer
try {
  devServer = await startDevServer()
  await checkPage("http://127.0.0.1:4173/study-materials")
  await checkPage("http://127.0.0.1:4173/os")
} catch (error) {
  console.error("[tmp-debug-pages] run failed", error)
  throw error
} finally {
  devServer?.kill()
}

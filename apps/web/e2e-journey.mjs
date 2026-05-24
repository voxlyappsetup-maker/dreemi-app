import { chromium } from "playwright";

const WEB = "http://localhost:3000";
const API = "http://localhost:3001";

const results = [];

function record(step, ok, detail = "") {
  results.push({ step, ok, detail });
  console.log(`[${ok ? "PASS" : "FAIL"}] ${step}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: "ar-SA" });
  const page = await context.newPage();

  try {
    // 1. Landing
    await page.goto(WEB, { waitUntil: "networkidle" });
    const title = await page.locator("h1").first().textContent();
    record("1. Open http://localhost:3000", title?.includes("قصص بلا نهاية") ?? false, title ?? "");

    // 2. CTA to register
    await page.getByRole("link", { name: "ابدأ مجاناً" }).click();
    await page.waitForURL("**/register");
    record("2. Click ابدأ مجاناً → /register", page.url().includes("/register"), page.url());

    // 3. Register
    await page.fill("#name", "Haden Test");
    await page.fill("#email", "haden2@qisas.app");
    await page.fill("#password", "Test1234!");
    await page.selectOption("#language", "ar");
    await page.getByRole("button", { name: "إنشاء الحساب" }).click();

    try {
      await page.waitForURL("**/dashboard", { timeout: 15000 });
      record("3–4. Register → /dashboard", true, page.url());
    } catch {
      await page.goto(`${WEB}/login`);
      await page.fill("#email", "haden2@qisas.app");
      await page.fill("#password", "Test1234!");
      await page.getByRole("button", { name: "دخول" }).click();
      await page.waitForURL("**/dashboard", { timeout: 15000 });
      record(
        "3–4. Register (existing user) → login → /dashboard",
        page.url().includes("/dashboard"),
        page.url()
      );
    }

    // 5. Dashboard welcome
    const heading = await page.locator("h1").first().textContent();
    const welcomeOk = heading?.includes("مرحباً") && heading?.includes("Haden Test");
    record("5. Dashboard shows مرحباً Haden Test", welcomeOk ?? false, heading ?? "");

    // 6. Go to generate
    await page.getByRole("link", { name: "قصة جديدة" }).click();
    await page.waitForURL("**/generate");
    record("6. Click قصة جديدة → /generate", page.url().includes("/generate"), page.url());

    // 7–8. Generate story
    await page.fill("#childName", "يوسف");
    await page.fill("#childAge", "5");
    await page.fill("#theme", "الفضاء والنجوم");
    await page.fill("#moral", "الشجاعة");
    await page.selectOption("#language", "ar");
    await page.getByRole("button", { name: "توليد القصة" }).click();

    await page.waitForSelector("text=نكتب قصة سحرية", { timeout: 5000 }).catch(() => {});
    record(
      "8a. Loading spinner appears",
      (await page.locator("text=نكتب قصة سحرية").count()) > 0,
      ""
    );

    await page.waitForSelector("article h2", { timeout: 120000 });
    const storyTitle = await page.locator("article h2").first().textContent();
    const storyContent = await page.locator("article .prose").first().textContent();
    record(
      "8b. Story displayed after submit",
      Boolean(storyTitle?.length && storyContent && storyContent.length > 50),
      storyTitle ?? ""
    );

    // Login page
    await page.goto(`${WEB}/login`);
    await page.fill("#email", "haden2@qisas.app");
    await page.fill("#password", "Test1234!");
    await page.getByRole("button", { name: "دخول" }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });
    record(
      "Login with same credentials",
      page.url().includes("/dashboard"),
      page.url()
    );

    // Refresh dashboard keeps logged in
    await page.reload({ waitUntil: "networkidle" });
    const afterReload = await page.locator("h1").first().textContent();
    record(
      "Refresh /dashboard stays logged in",
      afterReload?.includes("Haden Test") ?? false,
      afterReload ?? ""
    );

    // Invalid token → login
    await page.evaluate(() => {
      localStorage.setItem("accessToken", "invalid.token.here");
      localStorage.setItem("refreshToken", "invalid");
      localStorage.setItem(
        "user",
        JSON.stringify({ id: "x", email: "x@test.com", name: "X" })
      );
    });
    await page.goto(`${WEB}/dashboard`, { waitUntil: "networkidle" });
    await page.waitForURL("**/login", { timeout: 10000 });
    record("Invalid token redirects to /login", page.url().includes("/login"), page.url());

    // API sanity
    const health = await fetch(`${API}/health`).then((r) => r.ok);
    record("API health check", health, API);
  } catch (err) {
    record("Unexpected error", false, err instanceof Error ? err.message : String(err));
  } finally {
    await browser.close();
  }

  console.log("\n--- Summary ---");
  const failed = results.filter((r) => !r.ok);
  if (failed.length === 0) {
    console.log("All steps passed.");
    process.exit(0);
  } else {
    console.log(`${failed.length} failed:`);
    for (const f of failed) console.log(`  - ${f.step}: ${f.detail}`);
    process.exit(1);
  }
}

main();

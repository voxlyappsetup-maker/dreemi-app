import dotenv from "dotenv";
import { readFileSync } from "fs";

// قراءة .env يدوياً
const env = readFileSync("C:/Projects/dreemi-app/.env", "utf8");
const apiKey = env.match(/MISTRAL_API_KEY="?([^"\n]+)"?/)?.[1];

console.log("API Key موجود:", !!apiKey);
console.log("أول 8 حروف:", apiKey?.substring(0, 8));

const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    model: "mistral-large-latest",
    temperature: 0.9,
    max_tokens: 500,
    response_format: { type: "json_object" },
    messages: [{
      role: "user",
      content: 'اكتب قصة قصيرة جداً (50 كلمة فقط) لطفل اسمه يوسف عمره 5 سنوات. اعد JSON فقط: {"title":"...","content":"...","moral":"..."}'
    }]
  })
});

console.log("HTTP Status:", response.status);

const text = await response.text();
console.log("=== الرد الخام ===");
console.log(text);
console.log("=================");

try {
  const data = JSON.parse(text);
  const content = data.choices?.[0]?.message?.content;
  console.log("=== محتوى Mistral ===");
  console.log(content);
  console.log("====================");
  const story = JSON.parse(content);
  console.log("=== القصة ===");
  console.log(story);
} catch(e) {
  console.error("خطأ في التحليل:", e.message);
}
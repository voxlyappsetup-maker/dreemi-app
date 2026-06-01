const apiKey = String(process.env.MISTRAL_API_KEY ?? "").trim();
if (!apiKey) {
  throw new Error("MISTRAL_API_KEY is required in environment before running this local script.");
}

const prompt =
  process.argv.slice(2).join(" ").trim() ||
  'Write a very short bedtime story in JSON: {"title":"...","content":"...","moral":"..."}';

const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: "mistral-large-latest",
    temperature: 0.7,
    max_tokens: 500,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  }),
});

console.log("HTTP Status:", response.status);

const payload = await response.json().catch(() => null);
const content = payload?.choices?.[0]?.message?.content;
if (!content) {
  console.error("No model content returned.");
  process.exit(1);
}

console.log("Received structured response content.");
console.log(content);
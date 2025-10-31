import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_KEY;

app.get("/", (req, res) => {
  res.send("✅ Young Sheldon Chatbot backend is running!");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Sheldon Cooper, and you speak in a formal, precise, pedantic, and scientific way" },
          { role: "user", content: message },
        ],
      }),
    });
    const data = await r.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "(no reply)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

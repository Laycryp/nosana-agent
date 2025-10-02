import "dotenv/config";
import express from "express";
import { z } from "zod";
import { getPrices } from "./tools.coingecko.js";

const app = express();
app.use(express.json({ limit: "100kb" }));

const lastQueries: Array<{ at: string; symbols: string[]; vs: string }> = [];

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/price", async (req, res) => {
  try {
    const bodySchema = z.object({
      symbols: z.array(z.string()).min(1),
      vs: z.string().min(2).optional(),
    });

    const body = bodySchema.parse(req.body);

    const result = await getPrices({
      symbols: body.symbols,
      vs: body.vs ?? "usd",
    });

    lastQueries.push({
      at: new Date().toISOString(),
      symbols: body.symbols,
      vs: body.vs ?? "usd",
    });
    if (lastQueries.length > 50) lastQueries.shift();

    res.json({ ok: true, data: result });
  } catch (err: any) {
    res.status(400).json({ ok: false, error: err?.message ?? "Unknown error" });
  }
});

app.get("/memory", (_req, res) => {
  res.json({ ok: true, lastQueries });
});

const PORT = Number(process.env.PORT ?? 8080);
app.listen(PORT, () => {
  console.log(`Agent listening on http://localhost:${PORT}`);
  console.log(`POST /price  { "symbols": ["btc","eth"], "vs": "usd" }`);
});

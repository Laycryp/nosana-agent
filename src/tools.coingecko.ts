import type { PriceQuery, PriceResult } from "./types.js";
import { PriceQuerySchema } from "./types.js";

function normSymbol(s: string): string {
  const map: Record<string, string> = {
    // Top L1s / Majors
    btc: "bitcoin",
    xbt: "bitcoin",
    eth: "ethereum",
    sol: "solana",
    ada: "cardano",
    bnb: "binancecoin",
    xrp: "ripple",
    doge: "dogecoin",
    ton: "the-open-network",
    trx: "tron",
    matic: "polygon-pos",
    avax: "avalanche-2",
    dot: "polkadot",
    atom: "cosmos",
    near: "near",
    apt: "aptos",
    sui: "sui",
    xlm: "stellar",
    ltc: "litecoin",
    etc: "ethereum-classic",
    fil: "filecoin",
    icp: "internet-computer",
    inj: "injective-protocol",
    uni: "uniswap",
    aave: "aave",
    link: "chainlink",
    arb: "arbitrum",
    op: "optimism",
    base: "base-protocol", // ملاحظة: ليس توكن BASE لسلسلة Coinbase
    sei: "sei-network",
    tia: "celestia",
    rune: "thorchain",
    kas: "kaspa",
    bonk: "bonk",
    pepe: "pepe",
    wif: "dogwifcoin",
    jup: "jupiter-exchange-solana"
  };
  const lower = s.trim().toLowerCase();
  return map[lower] ?? lower;
}

export async function getPrices(input: unknown): Promise<PriceResult> {
  const parsed: PriceQuery = PriceQuerySchema.parse(input);

  const cleaned = parsed.symbols.map((s) => s.trim()).filter((s) => s.length > 0);
  const unique = Array.from(new Set(cleaned));
  if (unique.length === 0) throw new Error("No valid symbols provided after normalization.");

  const ids = unique.map(normSymbol).join(",");
  const vs = parsed.vs.toLowerCase();

  const url = new URL("https://api.coingecko.com/api/v3/simple/price");
  url.searchParams.set("ids", ids);
  url.searchParams.set("vs_currencies", vs);

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "nosana-agent/1.0 (+https://example.com)",
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CoinGecko error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as PriceResult;
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    throw new Error("No prices returned. Check symbols/IDs mapping or try different symbols.");
  }

  return data;
}

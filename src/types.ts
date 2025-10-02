import { z } from "zod";

export const PriceQuerySchema = z.object({
  symbols: z
    .array(z.string().min(1))
    .min(1, "Provide at least one symbol, e.g. ['btc','eth']")
    .max(25, "Max 25 symbols per request"),
  vs: z.string().min(2).default("usd"),
});

export type PriceQuery = z.infer<typeof PriceQuerySchema>;

export type PriceResult = Record<
  string,
  {
    [vs: string]: number;
  }
>;

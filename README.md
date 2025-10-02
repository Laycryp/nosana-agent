# Nosana Crypto Price Agent

A minimal HTTP agent that fetches crypto prices from CoinGecko (no API keys).
Built with **TypeScript + Express + Zod**, containerized with **Docker**, and deployed on **Nosana**.

- Public service: https://42a3duavy5ftor64hmsynk39ojsalbmu4dxp11ytr4va.node.k8s.prd.nos.ci
- Docker image: https://hub.docker.com/r/laycryp/nosana-agent
- Nosana job: https://dashboard.nosana.com/jobs/2odJ7CvEQ9MX1FrUCDtNYQ4dUhVUU8za21bbxkhiRoqP

## Endpoints
- `GET /health` → `{ "ok": true }`
- `POST /price`
  - Request:
    ```json
    { "symbols": ["btc","eth","sol","arb","op"], "vs": "usd" }
    ```
  - Response (example):
    ```json
    { "ok": true, "data": { "bitcoin": {"usd": 12345.67} } }
    ```

## Local Dev
```bash
npm install
npm run dev
# http://localhost:8080/health

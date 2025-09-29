## Balanz – Project Plan (Nigeria)

### Vision
- **Goal**: Balanz unifies balances, transactions, budgets, and insights across Nigerian bank accounts.
- **Scope (MVP)**: Auth, connect bank(s), fetch + display accounts and transactions, basic categorization, simple charts.

### Tech Stack
- **App**: Expo (React Native), TypeScript, Zustand (state), react-hook-form + zod (forms), react-native-svg + victory-native (charts)
- **Backend**: Supabase (Postgres + RLS), Edge Functions (webhooks + token exchange)
- **Bank Aggregation**: Mono or Okra (Nigeria)
- **Storage/Security**: expo-secure-store (tokens), MMKV/AsyncStorage (cache)
- **Utilities**: date-fns, Dinero.js (money), ESLint/Prettier (quality)

### Local Setup
1) Install deps
```bash
npm i
```
2) Align testing (React 19 path)
```bash
npm i -D jest-expo@~53.0.0 react-test-renderer@19.0.0
npm rm react-shallow-renderer
```
3) Start
```bash
npm run start
```

### Environment Config
- Create a Supabase project.
- Create a Mono (or Okra) app in sandbox, get public/secret keys.
- Create `.env` (or Expo env) with:
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
MONO_PUBLIC_KEY=...
MONO_SECRET_KEY=...
```

### Data Model (initial)
- `profiles` (id, user_id, email, display_name, created_at)
- `provider_accounts` (id, user_id, provider, provider_account_id, status, linked_at)
- `accounts` (id, user_id, provider_account_id, bank_name, account_name, account_number_masked, type, currency, balance, last_synced_at)
- `transactions` (id, user_id, account_id, posted_at, amount_minor, currency, description, merchant, category_id, metadata)
- `categories` (id, name, parent_id, icon)
- `budgets` (id, user_id, category_id, amount_minor, period_start, period_end)
- `rules` (id, user_id, contains/regex, assign_category_id, priority)

### Edge Functions (Supabase)
- `connect/exchange-token`: exchange provider public token → access token; store server-side.
- `webhooks/transactions`: receive provider events, upsert accounts/transactions.
- `sync/on-demand`: fetch latest balances/transactions.

### App Flows
1) Onboarding/Auth (Supabase Auth)
2) Connect Bank (Mono/Okra widget → token exchange)
3) Initial Sync (server fetch → client displays)
4) Transactions: list, filter, detail, edit category
5) Budgets: monthly targets, progress, alerts (v1)

### Screens (MVP)
- Dashboard: total NGN balance, per-account cards, last 5 transactions, quick insights
- Transactions: list w/ filters (date, account, category), detail
- Accounts: linked accounts, add new, status
- Settings: profile, privacy, export

### Categorization Strategy
- Client: quick rules (contains/regex) for immediate UX
- Server: apply rules on webhook/sync, store result for consistency

### Money & Currency
- Store amounts in minor units (kobo). Use Dinero.js for safe arithmetic.
- Default currency NGN; plan for multi-currency later.

### Security
- Store provider access tokens only on server. Never in client storage.
- Use RLS for per-user isolation. Grant least privileges.
- Mask account numbers; avoid storing full PAN or PII beyond necessity.

### Milestones
- Week 1: Base UI, auth, navigation, Supabase schema, provider sandbox setup
- Week 2: Connect flow, token exchange, initial sync, accounts/transactions UI
- Week 3: Categories + editing, charts, search/filter, local cache
- Week 4: Budgets, alerts, webhooks, polish, tests

### Task Checklist (rolling)
- [ ] Supabase schema + RLS
- [ ] Edge Function: token exchange
- [ ] Edge Function: webhooks upsert
- [ ] Mono/Okra sandbox connect flow
- [ ] Accounts UI
- [ ] Transactions list + filters + detail
- [ ] Categorization rules (client + server)
- [ ] Charts (spend by category, 30-day trend)
- [ ] Budgets + alerts
- [ ] Basic tests (money math, categorizers)

### Code Standards
- Type-safe public APIs; avoid `any`
- Guard clauses > deep nesting; handle errors up-front
- Keep components small, use composable UI
- No inline comments for trivial code; comment “why” for complex logic

### Notes
- If bank aggregation isn’t possible for a bank, support CSV import as a fallback.
- Add pull-to-refresh in lists; progressive loading for long histories.



# AI/ML Decision Guide for Biological Science

An interactive decision tree that helps biological science researchers find the right AI/ML tool for their task. Users start from a **cognitive goal** (Find, Predict, Generate, Optimize, Understand, Automate, Communicate) and answer domain-specific questions to reach actionable tool recommendations with code examples and Claude Code prompts.

Built for the AI Clinic series.

## Quick Start

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase credentials
npm run dev                         # http://localhost:3000
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Supabase** for persistence (tool upvotes, feedback)
- **Tailwind CSS 4** (configured, inline styles used in components)

## Project Structure

```
app/
  page.js              Root page, renders <DecisionTree />
  layout.js            Root layout (Geist font, metadata)
  api/votes/route.js   POST/GET tool upvotes
  api/feedback/route.js POST missing-option feedback
components/
  DecisionTree.jsx     Main component: navigation state, layout shell
  QuestionNode.jsx     Branch nodes with clickable options
  TerminalNode.jsx     Tool recommendation pages
  ToolCard.jsx         Individual tool card (votes, code examples, tags)
  IconLegend.jsx       Dismissable icon/badge legend popup
  Breadcrumbs.jsx      Path-based navigation
  ParadigmBanner.jsx   ML paradigm education banners
data/
  nodes.js             All decision tree content (source of truth)
lib/
  supabase.js          Supabase client
  session.js           Anonymous session (localStorage UUID)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

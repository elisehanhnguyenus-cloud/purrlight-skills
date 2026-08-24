# 🕳️ Deep Critique — a 10-round blind-spot hunt for Claude

🇬🇧 English · [🇻🇳 Tiếng Việt](README.md)

> **The first Vietnamese-authored deep-critique skill for Claude.** Before you spend the
> money, sign the contract, quit the job or commit to a plan — Deep Critique runs that
> decision through **10 rounds of adversarial review, each from a different lens**, to find
> the weaknesses and blind spots that you **and the AI itself** normally miss.

**Install in 30 seconds (Claude Code):**

```
/plugin marketplace add elisehanhnguyenus-cloud/purrlight-skills
/plugin install deep-critique@purrlight-skills
```

On claude.ai (web / mobile)? → [download this zip](dist/deep-critique-claude-ai.zip) and
follow the [4-step install](#option-b--claudeai-web--mobile).
Using Codex or another agent? → see [AGENTS.md](AGENTS.md).

> The skill's instructions are written in Vietnamese, but Claude **answers in whatever
> language you write in** — ask in English and the critique comes back in English.

---

## How is this different from asking AI to "critique my plan"?

Ask once and you get the *most obvious* risks, followed by reassurance that the plan looks
"broadly sound". Ask again and the same points come back in new words. Deep Critique is
built specifically to break that trap:

| Mechanism | Why it matters |
|---|---|
| **10 lenses, not 10 asks** | A blind spot is by definition invisible from where you stand — so every round moves you: reframe the problem → decompose the system → audit assumptions → steelman the opposition → invert → stakeholders & second-order effects → outside view (base rates) → **the AI's own blind spots** → pre-mortem → synthesis and ranking |
| **Anti-repetition law** | Later rounds are **forbidden** from restating earlier findings. A round that turns up nothing must declare itself a **"dry round"** — honest emptiness beats recycled insight dressed up as diligence |
| **Every finding must be testable** | A finding with no *"cheapest way to verify this in ≤1 week"* is just worry — it gets demoted or dropped |
| **Round 8: the AI audits itself** | The round I haven't seen in any other skill: Claude lists its own biases across the previous seven rounds, and what it *cannot in principle know* (your real cash flow, health, family, relationships) |
| **Industry lens libraries** | When the topic matches a shipped industry library (e-commerce today), every round also gets **industry-specific probes** — the places plans in that trade actually die, which practitioners know and plans forget. Loaded on demand; costs nothing when the topic doesn't match |
| **Three grades of evidence** | Every finding is labelled certain (with source) / inference (with logic) / speculation — never blended to sound more confident than it is |

**Measured result** (same prompt, same Claude model, auto-graded by a counting script):

| | Deep Critique, 10 rounds | Plain AI critique |
|---|---|---|
| Findings | **36** | 22 |
| Findings with a concrete verification step | **36/36** | ~1 |
| Web sources checked | ~10 | 0 |
| Questions put back to the planner | 5 | 0 |
| Declares its own limitations | Yes | No |

The counts matter less than *what* the plain run missed: it lost the entire top-severity
class — contradictions between the plan and the planner's own internal documents, options
hidden by the way the question was framed, and structural risk multiplication (~8
"acceptable" risks compounding into a ~90% chance of at least one incident).

📋 **See the output first**: [sample report from a real run (anonymized)](docs/BAO-CAO-MAU.md) *(in Vietnamese)*

## Install

### Option A — Claude Code (recommended; runs 5 rounds in parallel)

```
/plugin marketplace add elisehanhnguyenus-cloud/purrlight-skills
/plugin install deep-critique@purrlight-skills
```

To update later: `/plugin marketplace update purrlight-skills`.

<details><summary>Or install manually, without commands</summary>

1. Download this repo (Code → Download ZIP) and unpack it.
2. Copy `plugins/deep-critique/skills/deep-critique` into `~/.claude/skills/`
   (Windows: `C:\Users\<you>\.claude\skills\`).
3. Copy `plugins/deep-critique/agents/deep-critic.md` into `~/.claude/agents/`.
</details>

### Option B — claude.ai (web + mobile)

1. Download [`dist/deep-critique-claude-ai.zip`](dist/deep-critique-claude-ai.zip).
2. On claude.ai (desktop): **Settings → Capabilities** → enable **Code execution and file creation**.
3. **Settings → Customize → Skills** → **+** → **Upload a skill** → pick the zip.
4. Toggle the skill on. The mobile app on the same account picks it up automatically.

### Option C — Codex, ChatGPT, other agents

The skill is plain Markdown with no scripts and no runtime, so it ports.
[`AGENTS.md`](AGENTS.md) is the cross-agent contract: it maps `$SKILL_DIR`, states which
host capabilities each part needs, and defines exactly how the method degrades when a host
can't spawn sub-agents, can't write files, or has no web search.

## How to use it

```
/deep-critique I want to quit a $1,000/month job to open a coffee shop with $20,000 in
savings. I've already viewed a location downtown. Tear it apart.
```

- Plain language triggers it too: *"critique this for me…"*, *"find the blind spots in…"*,
  *"what's wrong with this plan?"*
- For smaller calls, run light: *"**quick critique:** [problem]"* → 5 rounds, ~⅓ the cost.
- **Highest-leverage tip:** paste in the real numbers, budgets and planning files. In the
  benchmark run, the single most valuable finding came from the skill cross-checking the
  plan against *the planner's own internal file* and catching a 153% budget contradiction.
- Selling online? The skill loads its **e-commerce lens library** automatically — cash conversion cycle, the real fee stack, return rates, IP exposure, platform dependency — each with a ready-made cheap verification.
- The report ends with **questions back to you**. Answer them, then ask for
  *"another cycle focused on X"* to dig a layer deeper.

You get back: a 3-line verdict → a ranked table of top blind spots (severity × likelihood)
→ what the original question should be rewritten as → all findings across the 10 rounds →
3 verifications worth doing this week → the critique's own limitations → 3–5 questions only
you can answer.

## Safety & transparency

- The whole package is **Markdown text** (process instructions for Claude) plus one JSON
  manifest. No scripts, no hooks, nothing executing in the background — open every file in
  a text editor and check.
- The `deep-critic` agent gets **read-only** tools (Read/Glob/Grep) plus web search. It
  cannot write files or run commands.
- The skill only sees what you put into the conversation, and everything runs inside your
  own Claude account.

## Limitations (stated plainly)

- 10 rounds are 10 passes of **the same AI**. Agreement across rounds is not the independent
  consensus of 10 human experts.
- It doesn't predict the future. It enumerates failure paths and how to test each one early
  — insurance for your thinking, not a crystal ball.
- Output quality tracks the context you provide. With no real numbers it can only critique
  logic; it can't catch contradictions in data it never saw.
- A full 10-round run consumes a meaningful chunk of your Claude plan's message limit. Use
  it for decisions that deserve it; ask normally for small stuff.

## Repository layout

```
purrlight-skills/
├── .claude-plugin/marketplace.json      ← marketplace catalog (install via /plugin)
├── AGENTS.md                            ← cross-agent contract (Codex & friends)
├── plugins/deep-critique/               ← full Claude Code plugin
│   ├── skills/deep-critique/            ← the 10-round skill + critic persona
│   │   └── references/                  ← persona + industry lens libraries (e-commerce)
│   └── agents/deep-critic.md            ← standalone critique agent
├── dist/deep-critique-claude-ai.zip     ← installer for claude.ai web/mobile
└── docs/BAO-CAO-MAU.md                  ← sample report (anonymized, from a real run)
```

## About the maker

Deep Critique is built and used in production at **PURRLIGHT STUDIO LLC** — a toy design
and handmade goods studio in Texas.

I'm a solo entrepreneur. I came from marketing and strategy on e-commerce marketplaces and
started building in 2018. I've been through a lot of niches — event services, craft
workshops, online retail, then print-on-demand, dropshipping, trademarked goods — and
**burned more than $20,000** on models that never converted.

Back then I wished I'd learned critical thinking sooner, and had more time to study business
models, so I wouldn't have poured money into niches that weren't worth it or were far too
risky. Deep Critique is the tool I wish I'd had in 2018: a review board that forces me to
test my assumptions *before* the money goes out, not after. The first version was validated
against my own studio's Q4 plan — it found 36 blind spots, including a budget contradiction
I had set up myself and forgotten.

## Roadmap

- [x] v1.1 — **E-commerce** industry lens library
- [ ] F&B and services lens libraries
- [x] Full Vietnamese–English bilingual docs
- [ ] Beginner kit: illustrated guide + Vietnamese walkthrough video

Feedback and bug reports: open an [Issue](../../issues) or message me directly. If the skill
catches a blind spot worth money to you, tell the story in Issues — that's the best payment
a maker gets.

---

<sub>MIT © 2026 PURRLIGHT STUDIO LLC · Claude is a trademark of Anthropic — this is an
independent community skill, not an official Anthropic product.</sub>

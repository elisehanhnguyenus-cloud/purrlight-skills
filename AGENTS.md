# AGENTS.md — purrlight-skills (cross-agent operating contract)

This repository is a **skill marketplace** from PURRLIGHT STUDIO LLC. The skills are
written for Claude and authored in Vietnamese, but they ship as **plain Markdown — no
scripts, no hooks, no runtime**. Any agent that reads `AGENTS.md` can run them.

Shipping now: **`deep-critique`** — a 10-round, 10-lens adversarial review of a plan or
decision, built to surface blind spots the planner *and the AI itself* would otherwise miss.

> **Claude Code** loads the skill directly (plugin or `~/.claude/skills/`) and never needs
> this file. **Codex and other `AGENTS.md`-aware agents** auto-load this file when working
> inside the repo, then defer to `SKILL.md` for the actual workflow. This file is the
> portability layer only — it does not restate the method.

---

## 1. Resolve `$SKILL_DIR` once, then reuse

`$SKILL_DIR` = the directory that contains the skill's `SKILL.md`.

| Context | Path |
|---|---|
| This repo / manual clone | `plugins/deep-critique/skills/deep-critique` |
| Manual install, Claude Code | `~/.claude/skills/deep-critique` |
| Plugin install, Claude Code | managed by Claude Code — do not hard-code |

Resolve it by locating `SKILL.md`. Never hard-assume `~/.claude`.

Files that matter:

- **`$SKILL_DIR/SKILL.md`** — the operating instructions (Vietnamese). **Read it in full
  before round 1.** It is the source of truth for the 10 lenses, the finding format, and
  the final report layout.
- **`$SKILL_DIR/references/deep-critic-persona.md`** — the critic persona. Load this when
  the host cannot spawn sub-agents (§3).
- **`plugins/deep-critique/agents/deep-critic.md`** — the Claude Code sub-agent definition
  (read-only tools: Read, Glob, Grep, WebSearch, WebFetch).

---

## 2. Runtime

**None.** No language runtime, no package manager, no install step, no network service.
The skill is instructions; the host supplies the capabilities. It needs at most three, and
degrades explicitly — never silently — when one is missing.

---

## 3. Capability matrix

| Host capability | Used for | If the host lacks it |
|---|---|---|
| **Sub-agents / parallel tasks** | one agent per round; rounds 3–7 dispatched in parallel | Load `references/deep-critic-persona.md`, adopt that persona, and run the rounds **strictly sequentially — one round per turn**. Merging rounds into one pass is the fastest way back to fake iteration and is forbidden. |
| **File read/write** | the critique notebook `Deep Critique/YYYY-MM-DD-<topic>.md`; reading the user's real project files | Keep the notebook as a single document/artifact and update it in place. If nothing persists at all, restate the condensed anti-repeat list at the top of every round. |
| **Web search / fetch** | fact-checking in rounds 3, 7, 9 (~6 targeted searches per run) | Label affected findings `suy luận` (inference) or `phỏng đoán` (speculation) — **never** `chắc chắn` (certain) — and record the gap in the report's limitations section. |

Never claim a round consulted a source or ran a tool that it did not.

---

## 4. Non-negotiables

Drop any of these and the host is no longer running Deep Critique:

1. **Ten lenses, not ten asks.** Reframe the problem → decompose the system → audit
   assumptions → steelman the opposition → invert → stakeholders & second-order effects →
   outside view (base rates) → **the AI's own blind spots** → pre-mortem & stress test →
   synthesize and rank. A blind spot is by definition invisible from where you stand, so
   each round must move.
2. **Anti-repetition law.** A round may record only findings not raised in any earlier
   round. A round that turns up nothing new is logged as a **dry round** — an honest dry
   round beats three recycled findings.
3. **No quotas.** Two sharp findings is a good round. Seven genuinely new ones is a good
   round. Padding every round to the same tidy count is itself a blind spot.
4. **Every finding carries its cheapest ≤1-week verification**, or it is demoted to
   speculation. A finding with no test is just worry.
5. **Evidence is typed** on every finding: certain (cite the source) / inference (state the
   logic) / speculation. Never blend them to sound more confident.
6. **The notebook is written to after every round**, not held in memory to the end. Long
   sessions get summarized; a notebook outside the context window does not.
7. **Round 8 is mandatory.** The AI audits its own previous seven rounds — its biases, and
   what it *cannot in principle know* (real cash flow, health, family, relationships).
8. **No flattery, no false balance.** "The plan is broadly sound, however…" is not part of
   this skill. Praise belongs elsewhere.

Finding format, identical in every round and every host:

```
### [Mã: <lens>-<n>] <One-line finding name>
- Mô tả: what breaks, how, under which conditions.
- Vì sao đây là điểm mù: why the planner and the earlier rounds missed it.
- Loại căn cứ: chắc chắn (cite source) / suy luận (state logic) / phỏng đoán.
- Nghiêm trọng: 1–5 (5 = kills the plan). Xác suất: thấp / vừa / cao.
- Cách kiểm chứng rẻ nhất: a concrete ≤1-week test that confirms or kills it.
```

---

## 5. Running it outside Claude Code

**Codex, in-repo (automatic).** Open Codex in this repository — it loads this file, then
follow `plugins/deep-critique/skills/deep-critique/SKILL.md`.

**Codex, globally.** Add one line to `~/.codex/AGENTS.md`:

> *For critique / red-team / decision-review tasks, read and follow
> `<path>/purrlight-skills/plugins/deep-critique/skills/deep-critique/SKILL.md`.*

**Codex slash command.** Copy `SKILL.md` to `~/.codex/prompts/deep-critique.md`, then
invoke `/deep-critique <the plan to review>`.

**Any chat model, no execution.** Paste `SKILL.md` into the conversation and run the rounds
sequentially in-thread, keeping the notebook as one message you rewrite each round. The
reasoning half of this skill needs no tooling at all — only rounds 3, 7 and 9 benefit from
web access, and §3 says what to do without it.

---

## 6. Never

- Merge several rounds into one pass to save turns.
- Downgrade to the 5-round quick mode unless the user explicitly asked for a quick pass.
- Pad a round to hit a number, or restate an earlier finding in new words.
- Report a source or a tool run that did not happen.
- Answer in a language other than the user's. The skill is authored in Vietnamese; the
  **output follows the user**, and the finding-block field names stay as written above so
  reports stay comparable across runs.

---

<sub>MIT © 2026 PURRLIGHT STUDIO LLC · Claude is a trademark of Anthropic — this is an
independent community skill, not an official Anthropic product.</sub>

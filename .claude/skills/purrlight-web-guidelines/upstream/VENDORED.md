# Vendored from Vercel's Web Interface Guidelines

- Rules: https://github.com/vercel-labs/web-interface-guidelines (MIT, © 2025 Vercel Labs; see `LICENSE` here),
  pinned commit `434b7f91364665f2f733b310ec54809bf8f37937`.
- Original skill: https://github.com/vercel-labs/agent-skills, `skills/web-design-guidelines/SKILL.md` (MIT per that
  repo's README "License" section), pinned commit `063bee94c3f4df8453406c830b0a7df0f2860278`.
- Vendored: 22/10/2026, by plain copy from those commits. Nothing from either repo was run.
- Files are byte-identical to upstream (git blob SHA-1, check with `git hash-object <file>`):

| Local path | Upstream | Blob |
|---|---|---|
| `LICENSE` | web-interface-guidelines `LICENSE` | `b3575a3c1358eac4b9ee36a4c851872d81417760` |
| `web-interface-guidelines.md` | web-interface-guidelines `command.md` | `3eb3a212b7b89493922ea418489d4c6f67ae8bd5` |
| `SKILL.upstream.md` | agent-skills `skills/web-design-guidelines/SKILL.md` | `ceae92ab319216a68274168fba9b63b998b65997` |

`SKILL.upstream.md` is kept only for attribution and comparison; it is renamed so Claude Code never loads it. The
house skill `../SKILL.md` replaces it. It reads this pinned copy instead of fetching
`raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` on every run, and adds the Purrlight
rule changes.

**Not vendored:**
- `install.sh`: writes to user-wide tool configs with curl from `main`.
- `AGENTS.md` and `README.md`.
- The other agent-skills skills: React, React Native, Vercel deploy and CLI-with-tokens, which clash with the GitHub
  Pages deploy, and writing-guidelines.

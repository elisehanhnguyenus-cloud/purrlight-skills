# Vendored from emilkowalski/skills

- Source: https://github.com/emilkowalski/skills (MIT, © 2026 Emil Kowalski; see `LICENSE` here)
- Pinned commit: `2d228630ba1446365f614a108cb8252f1feda202`
- Vendored: 22/10/2026, by plain copy from that commit. Nothing from the repo was run. The repo has no scripts,
  hooks or package files.
- Contents are byte-identical to upstream (git blob SHA-1, check with `git hash-object <file>`). One local change:
  the two upstream `SKILL.md` files are renamed `SKILL.upstream.md`, so Claude Code does not load them as skills of
  their own. They are read only through the house wrapper `../SKILL.md`.

| Local path | Upstream path | Blob |
|---|---|---|
| `LICENSE` | `LICENSE` | `57b46f1fd11dc62351ea548104a88aa3f659c11b` |
| `animate/SKILL.upstream.md` | `skills/animate/SKILL.md` | `7c3b20c6ed681b2d47c9ca9e3ee0e659ed47d032` |
| `animate/RECIPES.md` | `skills/animate/RECIPES.md` | `6744891261bdf0bb0473d77f2cc706f2d78b574e` |
| `review-animations/SKILL.upstream.md` | `skills/review-animations/SKILL.md` | `577a64397267ce20960de2202950594d5bd6f9b6` |
| `review-animations/STANDARDS.md` | `skills/review-animations/STANDARDS.md` | `863ea12ea94c1f7a47b5f7e1019e976aa82bd4cd` |

**Not vendored, on purpose.** The other 13 skills were left out:
- emil-design-eng, improve-animations, find-animation-opportunities, animation-performance and animation-vocabulary
  overlap with these two and carry more React content;
- apple-design, mobile-native, animate-expo and write-swift are for native apps;
- prototype, break-ui, pick-ui-library and ask-sonner suit npm/React projects.

The rules that override these files are in `../../BRAND-LOCKED.md`.

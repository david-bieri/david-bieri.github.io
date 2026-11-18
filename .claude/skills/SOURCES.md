# Vendored skills

Copied into the repo so every session (cloud or local) uses the same versions. To update one, replace its folder with the newer copy and update this table.

| Skill | Version | Source |
|---|---|---|
| `impeccable` | 4.8.0 (commit 687bc38) | https://github.com/pbakaus/impeccable — `.claude/skills/impeccable` |
| `motion` (+ `.claude/agents/motion-reviewer.md`) | motion-ai 14.2.0 | https://github.com/motiondivision/ai-kit — npm `motion-ai`, `content/` |
| `design-taste-frontend` | tasteskill 2.5.1 (commit f6b7657, 7 Nov 2026) | https://github.com/Leonxlnx/taste-skill — `skills/taste-skill`, slimmed: see below |

All three are licensed by their authors (Impeccable: Apache 2.0, Motion AI Kit: MIT, tasteskill: MIT, licence file in its folder).

## design-taste-frontend: what was left out, and how to run it

The upstream folder is 40 MB, most of it stock photographs, 3D objects, scenes and icon packs for building landing pages. This site uses the skill only as a critic (its consistency checker and its anti-"AI-made" lens on layout, copy and repetition; CLAUDE.md says to ignore its photography, shader, scene and one-section-per-screen prescriptions), so the copy here keeps `SKILL.md`, `references/`, `scripts/`, `library/` and `assets/layout` + `assets/components` + `assets/starter.html`, and drops `assets/{photos,scenes,objects,icons,moments,backgrounds,diagrams,effects,motion,ui}` and the demo photos in `assets/layout/img`. If you ever want the full kit, run the upstream install instead: `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"`.

Its `Stop` hook exits at once unless a `.taste-skill/build.json` exists in the project, so it does nothing here unless you start one of its builds. `.taste-skill/` is git-ignored.

To run the checker on the local server (Node 22+; in a container where Chromium needs `--no-sandbox`, point `CHROME_PATH` at a two-line wrapper that adds the flag):

```bash
node .claude/skills/design-taste-frontend/scripts/consistency.mjs http://127.0.0.1:8080/index.html --quick --widths 1440,390 --profile .taste-skill/chrome-check
```

Read its FAILs against CLAUDE.md: `hero-fill`, `one-section`, `one-heading`, `no-visual`, `cta`, `postcode` (it trips on "VA 24061") and the copy rules are landing-page rules and do not apply; `tap-size`, `text-contrast`, `focus-visible`, `share-meta`, `heading-scale` and `row-lines` are worth reading.

# Vendored skills

Copied into the repo so every session (cloud or local) uses the same versions. To update one, replace its folder with the newer copy and update this table.

| Skill | Version | Source |
|---|---|---|
| `impeccable` | 4.8.0 (commit 687bc38) | https://github.com/pbakaus/impeccable — `.claude/skills/impeccable` |
| `motion` (+ `.claude/agents/motion-reviewer.md`) | motion-ai 14.2.0 | https://github.com/motiondivision/ai-kit — npm `motion-ai`, `content/` |
| `design-taste-frontend` | tasteskill 2.5.1 (commit f6b7657, 7 Nov 2026) | https://github.com/Leonxlnx/taste-skill — `skills/taste-skill`, slimmed: see below |
| `ui-ux-pro-max` | 2.15.0 (commit 2de1134, 19 Nov 2026) | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill — `.claude/skills/ui-ux-pro-max`; see below |

All four are licensed by their authors (Impeccable: Apache 2.0, Motion AI Kit: MIT, tasteskill: MIT, UI UX Pro Max: MIT; licence files in the tasteskill and UI UX Pro Max folders).

## design-taste-frontend: what was left out, and how to run it

The upstream folder is 40 MB, most of it stock photographs, 3D objects, scenes and icon packs for building landing pages. This site uses the skill only as a critic (its consistency checker and its anti-"AI-made" lens on layout, copy and repetition; CLAUDE.md says to ignore its photography, shader, scene and one-section-per-screen prescriptions), so the copy here keeps `SKILL.md`, `references/`, `scripts/`, `library/` and `assets/layout` + `assets/components` + `assets/starter.html`, and drops `assets/{photos,scenes,objects,icons,moments,backgrounds,diagrams,effects,motion,ui}` and the demo photos in `assets/layout/img`. If you ever want the full kit, run the upstream install instead: `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"`.

Its `Stop` hook exits at once unless a `.taste-skill/build.json` exists in the project, so it does nothing here unless you start one of its builds. `.taste-skill/` is git-ignored.

To run the checker on the local server (Node 22+; in a container where Chromium needs `--no-sandbox`, point `CHROME_PATH` at a two-line wrapper that adds the flag):

```bash
node .claude/skills/design-taste-frontend/scripts/consistency.mjs http://127.0.0.1:8080/index.html --quick --widths 1440,390 --profile .taste-skill/chrome-check
```

Read its FAILs against CLAUDE.md: `hero-fill`, `one-section`, `one-heading`, `no-visual`, `cta`, `postcode` (it trips on "VA 24061") and the copy rules are landing-page rules and do not apply; `tap-size`, `text-contrast`, `focus-visible`, `share-meta`, `heading-scale` and `row-lines` are worth reading.

## ui-ux-pro-max: changes from upstream

Copied from the upstream repo's `.claude/skills/ui-ux-pro-max` (3.4 MB: `SKILL.md`, `references/`, `scripts/`, `data/`), with `LICENSE` added from the repo root and the developer test suite `scripts/tests/` left out. Upstream's `SKILL.md` calls its search script through `${CLAUDE_PLUGIN_ROOT}`, which is only set for a plugin install; here those calls use `$CLAUDE_PROJECT_DIR` instead. The script is plain Python 3 with no dependencies and makes no network requests (its `--preview` mode writes HTML that links Google Fonts; don't use that output on this site).

Its palette, font-pairing and style recommendations do not apply here: CLAUDE.md fixes the tokens, Archivo and Source Serif 4, and the plain-HTML stack. Use it for its UX and accessibility guidelines (`--domain ux`) and as a review checklist (`references/pro-rules.md`, `references/quick-reference.md`). Don't use `--persist`, which writes a `design-system/` folder into the project.

Alternative install (not used here): `npx ui-ux-pro-max-cli init --ai claude`.

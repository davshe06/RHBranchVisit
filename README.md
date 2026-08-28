# RH Branch Visit — prototype

Static prototype of the **Branch Visit Prep** agent for Robert Half Market Directors.
It covers the desktop workspace (brief card, KPI strip, trend chart, desk table, right rail,
drill panel) and the mobile pre-visit read, switchable with the Desktop/Mobile toggle.

**All data is dummy data.** No auth, no backend, no CRM integration.

**Live site:** https://davshe06.github.io/RHBranchVisit/

## What's here

- `index.html` — the entire prototype, self-contained. No build step, no dependencies,
  no external requests; it works offline.
- `.nojekyll` — stops GitHub Pages running Jekyll over the files.

## Don't hand-edit `index.html`

It is **compiled output**. Change the design in the source project and re-export, then
replace the file wholesale. Edits made directly to this file will be lost on the next export.

## Notes

- The Robert Half wordmark in the header is a text placeholder; no brand assets are included here.
- `design_handoff_branch_visit_prep/README.md` in the source project holds the full
  implementation spec (color tokens, type scale, spacing, layouts, interaction rules, flag rules,
  data shapes) for rebuilding this as a real application.

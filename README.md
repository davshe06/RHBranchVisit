# RH Branch Visit

**Branch Visit Prep** — a workspace for Robert Half Market Directors preparing a
branch visit. Desktop workspace plus a mobile pre-visit read.

**All data is dummy data.** No auth, no backend, no CRM integration.

**Live site:** https://davshe06.github.io/RHBranchVisit/

---

## What's in here

| Path | What it is |
|---|---|
| `app/` | The React + TypeScript + Vite application. This is the real thing. |
| `design_handoff_branch_visit_prep/README.md` | The implementation spec — tokens, type scale, layouts, chart geometry, flag rules, data shapes. |
| `index.html` | The original static prototype. **Compiled output — do not hand-edit.** |
| `.github/workflows/deploy.yml` | Builds `app/` and publishes it to Pages on every push to `main`. |

The prototype is kept as the design reference. It is published alongside the app
at [`/RHBranchVisit/prototype/`](https://davshe06.github.io/RHBranchVisit/prototype/).

## The app

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into app/dist
npm run preview    # serve the built output
```

Stack: React 18, TypeScript (strict), Vite 6, CSS Modules, Lucide icons. No
component library and no charting library — the four line charts are hand-rolled
SVG, per the spec. Barlow and Barlow Condensed are self-hosted, so the app makes
**no external network requests**.

### Structure

```
app/src/
  styles/     tokens.css — the token layer; base.css; self-hosted fonts
  data/       types.ts — the CRM seam
              branches.ts / branches.more.ts — seven branches of dummy data
              derive.ts — flags, talking points, cell colouring, chart maths
              repository.ts — MockBranchRepository behind BranchRepository
  components/ TopBar, BriefCard, KpiStrip, TrendChart, DeskTable,
              RightRail, DrillPanel, MobileWorkspace
  hooks/      useMediaQuery (breakpoints), useBranch (loads through the seam)
```

### Where real data lands

`app/src/data/types.ts` defines the CRM shapes and the `BranchRepository`
interface. `MockBranchRepository` is the only implementation today; a live
adapter implements the same interface and `repository.ts` is the only file that
needs to change. Nothing in `components/` reaches past that boundary.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds `app/` and
publishes it to GitHub Pages.

> **One-time setting:** Settings → Pages → Source must be **GitHub Actions**
> (not "Deploy from a branch"). Until it is switched, Pages keeps serving the
> old branch-based deploy of the root `index.html` prototype.

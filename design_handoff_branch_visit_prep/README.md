# Branch Visit Prep — implementation spec

The original handoff document was not available when the React app was built, so
this spec was **reconstructed from the prototype's own source**. The prototype
(`index.html` at the repo root) is a bundled artifact; its uncompiled template, token
stylesheet and data script were recovered from the bundle and are the authority
for everything below. Where this document states a number, that number is what
the prototype renders.

Anything marked **[new]** was not in the prototype and was added during the
rebuild, either because the task called for it or because the prototype left it
unfinished.

---

## 1. Colour

### Roles

| Role | Value | Use |
|---|---|---|
| Chrome red | `#A81A14` | The top bar **only**. Never a data colour — never a chart stroke, cell colour, bar fill, or delta. |
| Accent blue | `#0c6ca8` | Carries data *and* interaction: chart lines, selected pills, links, focus ring, primary buttons, sales avatars. |
| Data red | `#c0392b` | Below expected range, negative deltas, unbackfilled ends. |
| Positive green | `#1f7a52` | Ahead of benchmark, positive deltas. |
| Warning amber | `#b57612` | Activity-below-range flags, benchmark rule, pending action state. |
| Muted slate | `#5f7183` | Secondary label text, recruiting-track avatars. |

The red/blue split is the one rule the design will not survive breaking: red is
brand chrome, blue is the data. A red data point and the red header must never
appear to be the same signal.

### Ground and ramp

```
--color-bg:        #f4f6f8      --color-surface:   #ffffff
--color-text:      #16232e      --color-divider:   #dde4ea

--color-accent-100 #e8f2f9   -200 #cfe3f1   -400 #4b9bd0
--color-accent-600 #0a5a8c   -700 #084a74   -800 #0a3a58   -900 #0b2d43

--color-neutral-100 #f5f5f8 … -600 #7a7a7d … -800 #424244  -900 #2b2b2d
```

`--color-accent-900` (`#0b2d43`) is the dark ground: drill-panel header and
mobile hero. `--color-accent-100` is the hover wash on every interactive row.

### Chart-only greys

```
--chart-prior       #aab6c0   dashed comparison line
--chart-axis-label  #7e8c99   month and tick labels
--chart-track       #e7edf2   bar-track background
```

---

## 2. Type

Barlow (body) and Barlow Condensed 600 (headings). Both are self-hosted from
`app/src/assets/fonts/` — 15 woff2 files in latin, latin-ext and vietnamese
subsets, extracted from the prototype bundle. **No external font requests.**

```
--font-body:            "Barlow", system-ui, sans-serif
--font-heading:         "Barlow Condensed", system-ui, sans-serif
--font-heading-weight:  600
```

Body sets `15px / 1.55`. Headings run `line-height 1.12`, `letter-spacing -0.015em`.

### Scale, as actually used

| Context | Size | Font | Notes |
|---|---|---|---|
| Brief headline | 25px | Condensed | `max-width: 64ch`, `text-wrap: pretty` |
| Brief body | 14px / 1.65 | Barlow | `max-width: 82ch` |
| Card kicker | 10px | Barlow | `letter-spacing .1em`, uppercase, accent blue |
| KPI label | 9.5px | Barlow | `letter-spacing .1em`, uppercase |
| KPI value | 31px | Condensed | `line-height 1` |
| KPI delta | 12px / 500 | Barlow | |
| KPI sub | 10.5px | Barlow | |
| Trend headline | 38px | Condensed | |
| Trend stat label | 9.5px | Barlow | uppercase, `.09em` |
| Trend stat value | 16px / 500 | Barlow | |
| Table header | 11px | Barlow | uppercase, `.08em`, 60% text |
| Table body | 14px | Barlow | `font-variant-numeric: tabular-nums` |
| Table name | 14px / 500 | Barlow | role beneath at 10.5px |
| Drill title | 22px | Condensed | kicker above at 10px, `.12em` |
| Drill mini value | 26px | Condensed | label 9.5px uppercase |
| Talking points | 13px / 1.65 | Barlow | colour `#334552` |
| Pills / filters | 12.5px | Condensed 600 | |
| Mobile hero title | 25px | Condensed | |

**Leading inside controls.** In the prototype every control's contents sit
inside a `<button>` that never received `font: inherit`, so they render on the
UA's `normal` leading rather than the body's 1.55. The rebuild reproduces this
explicitly: `line-height: normal` on the KPI card, flag chip, pill, suggestion
chip, top-bar tab and drill rank row; `line-height: 1.2` on `.btn`. Without it
every control is 3.4px taller and the KPI strip 15px taller.

---

## 3. Spacing, radii, elevation

The spacing scale is 3.4px-based — unusual, and deliberate:

```
--space-1 3.4px   --space-2 6.8px   --space-3 10.2px
--space-4 13.6px  --space-6 20.4px  --space-8 27.2px
```

Radii: cards `12px`, controls (buttons, inputs, pills) `9px`, tags and chips
`999px`, avatars `8px`.

```
--shadow-sm  0 1px 2px rgba(11,45,67,.07), 0 1px 3px rgba(11,45,67,.05)
--shadow-md  0 2px 6px rgba(11,45,67,.07), 0 8px 20px rgba(11,45,67,.07)
--shadow-lg  0 12px 40px rgba(11,45,67,.18)
```

Cards are `--color-surface` + 1px `--color-divider` + `--shadow-sm`. Hover on an
interactive card lifts to `--shadow-md` and borders `--color-accent-200`.

---

## 4. Layout

### Desktop workspace

```
top bar (sticky, 53px, chrome red)
└ grid  minmax(0,1fr) / 336px   gap 22px   padding 22px 26px 56px   max-width 1720px
  ├ main (gap 20px)
  │   brief card        padding 19px 21px, gap 13
  │   KPI strip         auto-fit minmax(158px,1fr), gap 13
  │   trend chart card  padding 17px 20px 10px, gap 12
  │   desk table card   padding 17px 20px, gap 11
  └ right rail (336px, sticky top 78px, gap 18px)
      proposed actions
      ask about this branch
```

### Breakpoints **[new]**

The prototype had no tablet step and faked mobile with three 390×800 device
frames. Both are now real:

| Width | Behaviour |
|---|---|
| > 1180px | Two columns, rail sticky. |
| ≤ 1180px | **Tablet collapse.** Grid goes single-column, rail drops below the workspace and stops being sticky, padding tightens to 18px. |
| ≤ 767px | **Mobile.** The real mobile layout renders; the header sheds its title block and preview toggle, and the branch selector goes full width. |

On a wide screen the header's Desktop/Mobile toggle previews the mobile layout
in a 430px column. That is a width constraint, not a device frame — the same
breakpoint CSS is what renders.

### Mobile screens

Three screens behind a tab bar (`Brief`, `Desks`, `Ask`), sticky under the header.

- **Brief** — dark hero (`#0b2d43`: kicker, branch name, specialty · desk count ·
  sync time), brief card, 2×2 KPI grid (Active JOs, Close ratio, Upcoming
  starts, Upcoming ends), flags list, proposed actions, "Open full branch data".
- **Desks** — one card per desk, **sorted by close ratio ascending** (worst
  first — the desks the visit is for). Avatar, name, role, close ratio coloured
  by benchmark, then JOs / Subs / Starts / Ends / MoM.
- **Ask** — scripted thread, composer pinned to the bottom.

Every card on Brief and Desks opens the same drill panel as desktop.

---

## 5. Charts

Hand-rolled SVG. Four line charts do not justify a charting library, and the
geometry below is exact.

### Main trend chart

`viewBox="0 0 880 248"`, rendered at `height: 238px` (190px on mobile).

- Plot box: x `56 → 866`, y `16 → 214`.
- Domain: `min = floor(min(all) × 0.92)`, `max = ceil(max(all) × 1.04)`, where
  `all` is the current series concatenated with the active comparison series.
- Gridlines: 5 ticks at quarters, `x1=46 x2=872`, `#16232e` at `stroke-opacity .09`.
  Tick labels `x=38`, `text-anchor=end`, 10.5px, `--chart-axis-label`.
- Area: the line path closed `L{x1} {y1} L{x0} {y1} Z`, accent at `fill-opacity .08`.
- Comparison line: `--chart-prior`, `stroke-width 1.6`, `stroke-dasharray "5 4"`.
- Current line: accent, `stroke-width 2.2`.
- Points: `r=3.1`, white fill, accent stroke `1.8`.
- Month labels at `y=240`, 10.5px; the latest month is accent, the rest
  `--chart-axis-label`.

### KPI sparkline

`60 × 19`. Self-scaling to its own min/max: `x = i × 60/(n-1)`,
`y = 17 − (v−min)/(max−min) × 15`. `stroke-width 1.4`, stroked in the KPI's own
delta colour.

### Person drill — close ratio

`viewBox="0 0 520 130"`, x `20 → 500`, y `14 → 110`, **fixed domain 10 → 42**.

- Desk line: the branch close-ratio series offset by `deskCloseRatio − benchmark`.
- Peer line: `--chart-prior`, `1.5`, dashed `5 4`.
- Benchmark rule: horizontal at `y = 110 − ((benchmark−10)/32) × 96`, amber,
  1px, labelled `benchmark N%` right-aligned 5px above.
- Month labels at `y=126`, 9.5px.

### Metric drill — branch trend

`viewBox="0 0 520 140"`, x `20 → 500`, y `14 → 116`, domain
`min(current) × 0.9 → max(current) × 1.05`. Current 2.2 accent, prior 1.5 dashed.
Month labels at `y=134`.

### Activity bars (person drill)

Track `--chart-track`, height 14px. Fill width `min(value / (expected × 1.6), 1)`,
green if `value ≥ expected` else data red, `opacity .75`. A 1px `#16232e` marker
sits at `1/1.6` of the track — the expected value. Value reads `{value} / {expected}`.

### Rank bars (metric drill)

Track `--chart-track`, height 15px, accent fill at `opacity .8`, width
`value / max × 100%`.

---

## 6. Derived values

### Flag rules

Each rule sweeps the whole floor before the next runs, so flags group by kind,
not by person. The list is capped at **7**.

| # | Condition | Label | Tone |
|---|---|---|---|
| 1 | `closeRatio < benchmark − 4` | `Close ratio {n}% vs {bench}% benchmark` | data red |
| 2 | `submittals < expected.submittals × 0.85` **or** `clientMeetings < expected.clientMeetings × 0.7` | `Activity below expected range` | amber |
| 3 | `endsNext30 − backfilled ≥ 3` | `{n} ends not backfilled` | data red |
| 4 | `abs(momPct) ≥ 20` | `{±n}% MoM swing` | green if positive, else data red |
| 5 | has a badge | `{badge} · {tenure} tenure` | accent blue |

Each flag chip carries a 3px left border in its tone and opens that person's drill.

### Table cell colouring

| Column | Rule |
|---|---|
| Close % | green if `≥ bench + 4`, red if `< bench − 4`, weight 500 |
| Ends (open) | rendered `{ends} ({unbackfilled})` when any are unbackfilled; red if `unbackfilled ≥ 3` |
| Conn / CVs / Intvw / Subs / ICMs | red if under the expected value for that measure |
| CVs | `—` on a sales desk (a recruiting measure) |
| MoM | green if `≥ 0`, else red, weight 500 |

Sorting is descending on the clicked column; default `cr`. Role filter is
All / Sales / Recruiting.

### Talking points

Appended in this order, all that apply:

1. `closeRatio < bench − 4` → qualification, not volume.
2. `closeRatio ≥ bench + 4` → best conversion, spread the routine.
3. `unbackfilled > 0` → redeploy conversations this week.
4. `submittals < expected` → activity is going in, not coming out.
5. `clientMeetings < expected` → client-facing time is the constraint.
6. has badge → measure on inputs for another quarter.
7. `abs(momPct) ≥ 20` → ask what changed.
8. If none apply → "Tracking to plan on every measure…"

---

## 7. Interactions

| Trigger | Result |
|---|---|
| Table row click **or** Enter/Space | Person drill |
| Flag chip | Person drill for that flag's consultant |
| KPI card | Metric drill for that KPI's series |
| Mobile desk card / flag / KPI | Same drills |
| Metric drill rank row | Person drill, **with a back arrow** to the metric **[new]** |
| Drill backdrop, ✕, or Escape | Close |
| Metric / compare / role pills | Filter in place |
| Column header | Sort descending |
| Ask suggestion or composer | Appends question + canned answer |
| Approve / Skip | Action moves to Approved / Skipped, buttons clear |
| Branch selector | Loads that branch **[new]** — and drops any open drill |

Drill panel: fixed right, `min(620px, 94vw)` (100vw on mobile), backdrop
`rgba(6,32,58,.42)`, `slidein .22s ease-out` from `translateX(24px)`. Focus moves
to the close button, is trapped while open, and body scroll is locked. **[new]**

### Focus

```css
:focus { outline: none; }
:focus-visible { outline: 2px solid #0c6ca8; outline-offset: 2px; }
```

Never the browser default. On the two dark grounds (top bar, drill header) the
ring keeps those exact values and gains a light halo for contrast. **[new]**

### Icons **[new]**

Lucide, `stroke-width 1.5`. `RotateCw` replaces the `↻` glyph on Regenerate (it
spins once, 620ms, on click), `X` replaces `✕` on the drill close, `ArrowLeft`
is the drill back control.

---

## 8. Data requirements — the CRM seam

`app/src/data/types.ts` is the contract. Everything downstream derives from it;
no view component reaches past it. `BranchRepository` is the integration point —
a live adapter implements the same interface and `repository.ts` is the only
file that changes.

```ts
interface Consultant {
  id: string; name: string; role: string;
  track: 'sales' | 'recruiting';
  tenure: string;               // "6 yr" / "8 mo"
  badge?: string;               // "Ramping" / "Rookie"
  jobOrders:  { active: number; open: number };
  placements: { closeRatioPct: number;   // whole percent
                startsNext30: number; endsNext30: number; backfilled: number };
  activity:   { connects: number;
                candidateVisits: number | null;  // null on a sales desk
                interviews: number; submittals: number; clientMeetings: number };
  momentum:   { momPct: number; qoqPct: number };
}

interface ActivityExpectations {
  connects; candidateVisits; interviews; submittals; clientMeetings: number;
}

type MetricKey = 'close' | 'active' | 'subs' | 'starts';

interface MetricSeries {
  label: string; unit: string;      // "%" or ""
  current: number[];                // 12 points, oldest first
  prior:   number[];                // same months, prior year
  peer:    number[];                // same months, peer average
}

interface Branch extends BranchSummary {
  visitDate; syncedAt; syncedTime: string;
  closeRatioBenchmark: number;
  expectations: ActivityExpectations;
  desks: Consultant[];
  series: Record<MetricKey, MetricSeries>;
  brief: { headline: string; body: string };
  actions: ProposedAction[];
  askPairs: AskPair[];              // canned question → answer
  kpiCopy: KpiCopy;                 // editorial deltas + the two 6-point sparks
  askGreeting: string;
  mobileThread: { who: 'assistant' | 'user'; text: string }[];
}

interface BranchRepository {
  listBranches(): Promise<BranchSummary[]>;
  getBranch(id: string): Promise<Branch>;
}
```

`MONTHS` is `Sep … Aug`, aligning every 12-point series.

`kpiCopy` exists because KPI deltas in the prototype are editorial strings
(`"+9% MoM"`, `"−1 pt vs peers"`) that do not always agree with the series they
sit next to. They are carried as data rather than silently recomputed.

### Dummy data **[new]**

Seven branches, each with its own desks, series, brief, actions and ask pairs.
Charlotte is reproduced **verbatim** from the prototype and is the design
reference. The other six were authored for the rebuild — in the prototype the
selector was cosmetic and every option rendered Charlotte.

| Branch | Specialty | Desks | Benchmark | Character |
|---|---|---|---|---|
| Charlotte | Finance & Accounting | 9 | 26% | Volume up, conversion drifting |
| Raleigh | Finance & Accounting | 8 | 26% | The steady one |
| Greensboro | Administrative & Customer Support | 7 | 22% | Highest volume, conversion falling every quarter |
| Charleston | Technology | 6 | 19% | Fastest growth, short on capacity |
| Nashville | Finance & Accounting | 10 | 26% | Biggest floor, widest desk spread |
| Atlanta North | Technology | 9 | 19% | Clean split, three desks carrying it |
| Birmingham | Legal | 5 | 24% | Best conversion, concentration risk |

Administrative, Technology and Legal carry their own `ActivityExpectations` —
an admin desk is expected to clear far more connects than a legal one.

Charlotte's prior-year and peer series are authored. The other six derive theirs
from the current line with a fixed ratio plus a seeded wobble, so the dashed
comparison reads as a real series rather than a scaled copy.

---

## 9. Known placeholders

- **Wordmark.** The header wordmark is the text "ROBERT HALF" plus a "logo
  placeholder" label. It stays that way until the brand asset is supplied.
- **Ask.** Canned question/answer pairs. A free-typed question that does not
  match returns a fixed "in the shipped version this routes to the branch data
  warehouse" reply.
- **Regenerate.** Spins the icon; does not regenerate the brief.
- **"Open full branch data"** (mobile) is inert.
- No auth, no backend, no CRM integration.

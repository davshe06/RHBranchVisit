import { series } from './branches';
import type { BranchSpec } from './branches';

/*
 * The six branches beyond Charlotte. In the prototype the selector was
 * cosmetic — every option rendered Charlotte's numbers. Each branch now has its
 * own desks, series, brief, flags and actions, sized and shaped to its
 * specialty: Technology converts lower than F&A, Administrative runs far higher
 * activity volume, Legal runs a small high-value desk.
 */
export const MORE_SPECS: BranchSpec[] = [
  // ── Raleigh — Finance & Accounting ───────────────────────────────────────
  {
    id: 'ral',
    name: 'Raleigh',
    specialty: 'Finance & Accounting',
    visitDate: 'Tue 8 Sep 2026',
    syncedAt: 'today 06:12',
    syncedTime: '06:12',
    benchmark: 26,
    rows: [
      ['Nathan Okafor', 'Practice Director, Sales', 'sales', '9 yr', 34, 12, 38, 9, 3, 3, 176, 0, 22, 33, 11, 7, 14],
      ['Bethany Cruz', 'Practice Director, Sales', 'sales', '4 yr', 27, 15, 29, 5, 5, 4, 154, 0, 15, 24, 8, 3, 5],
      ['Wesley Tran', 'Practice Director, Sales', 'sales', '1 yr', 18, 13, 21, 3, 2, 2, 168, 0, 10, 16, 5, 24, 33, 'Ramping'],
      ['Grace Lindqvist', 'Recruiting Manager', 'recruiting', '6 yr', 31, 14, 33, 8, 4, 4, 158, 118, 25, 36, 10, 9, 11],
      ['Ibrahim Sayed', 'Recruiting Manager', 'recruiting', '3 yr', 25, 17, 24, 4, 6, 3, 133, 92, 16, 22, 6, -6, -2],
      ['Holly Barnes', 'Recruiter', 'recruiting', '5 yr', 28, 11, 31, 6, 3, 3, 147, 101, 20, 31, 9, 5, 8],
      ['Devon Marsh', 'Recruiter', 'recruiting', '2 yr', 21, 16, 20, 3, 5, 1, 121, 78, 12, 17, 4, -18, -12],
      ['Amara Bello', 'Recruiter', 'recruiting', '7 mo', 11, 8, 18, 2, 1, 1, 194, 96, 9, 14, 6, 38, 41, 'Ramping'],
    ],
    series: {
      close: series('Close ratio', '%', [25, 26, 27, 28, 28, 29, 28, 27, 28, 29, 28, 27], { priorRatio: 0.94, peerRatio: 0.98, seed: 21 }),
      active: series('Active JOs', '', [162, 168, 171, 174, 180, 184, 189, 186, 190, 193, 191, 195], { priorRatio: 0.9, peerRatio: 1.01, seed: 22 }),
      subs: series('Submittals', '', [164, 172, 168, 159, 186, 194, 201, 193, 188, 196, 190, 193], { priorRatio: 0.92, peerRatio: 1.04, seed: 23 }),
      starts: series('Starts', '', [30, 32, 29, 27, 34, 37, 39, 36, 33, 37, 35, 40], { priorRatio: 0.89, peerRatio: 0.95, seed: 24 }),
    },
    brief: {
      headline: 'The most consistent branch in the market — the risk here is complacency, not performance.',
      body: 'Raleigh runs 195 active JOs and a 27% close ratio, a point above the peer average and steady inside a two-point band all year. Forty starts land in the next 30 days, the best month of the trailing twelve. Two desks pull the average down: Devon Marsh at 20% with an 18% MoM drop, and Ibrahim Sayed at 24% carrying six upcoming ends against three backfills. Wesley Tran and Amara Bello are both inside their first year and climbing fast — read them on activity, not conversion. There is no fire to put out; the conversation is about what the top three desks are doing that the bottom two are not.',
    },
    actions: [
      { id: 'a1', title: 'Pair Devon Marsh with Holly Barnes', body: 'Same role, same desk size, eleven points of close ratio between them. Set up two weeks of shadowed debriefs.' },
      { id: 'a2', title: 'Backfill sweep', body: 'Nine of 29 upcoming ends have no backfill in play. Six sit on the two recruiting managers.' },
      { id: 'a3', title: 'Recognition — Nathan Okafor', body: '38% close ratio on 33 submittals and nine starts landing. Strongest single desk in the market this month.' },
    ],
    askGreeting: 'Ask me anything about Raleigh — Active JOs, close ratio, activity and 12-month trend are loaded for all eight desks.',
    askPairs: [
      { question: 'Who slipped most this month?', answer: 'Devon Marsh: down 18% MoM with a 20% close ratio against a 26% benchmark, and five upcoming ends with one backfill. Ibrahim Sayed is second at 24% and down 6%.' },
      { question: 'Which open JOs are aging?', answer: 'Seven open JOs are past 21 days with no submittal, five of them on Devon Marsh and Ibrahim Sayed. Wesley Tran holds two that are aged but active — both have interviews booked this week.' },
      { question: 'How does Raleigh compare to peers?', answer: 'Active JOs 195 against a peer average of 197, so volume is level. Close ratio is 27% against 26% peer — Raleigh wins on conversion, not on demand. That is the opposite shape to Charlotte.' },
      { question: 'What should I open the meeting with?', answer: 'Open on consistency: close ratio has stayed inside 25–29% for twelve months while the market swung five points. Then ask Nathan and Holly to walk the floor through their qualification routine.' },
    ],
    kpiCopy: {
      activeDelta: '+2% MoM', activeSub: 'peer avg 197', openDelta: '7 aged >21d', openSub: 'no submittal yet',
      closeDelta: '+1 pt vs peers', startsDelta: '+14% YoY', startsSub: 'next 30 days', endsSub: 'next 30 days',
      subsDelta: '+2% MoM', subsSub: 'trailing 30 days',
      openSpark: [118, 114, 111, 108, 106, 106], endsSpark: [24, 26, 28, 27, 29, 29],
    },
    mobileThread: [
      { who: 'assistant', text: 'Raleigh is steady on every measure. Want the two desks below the line?' },
      { who: 'user', text: 'Yes' },
      { who: 'assistant', text: 'Devon Marsh at 20% and Ibrahim Sayed at 24%, against a 26% benchmark. Between them 33 open JOs and 11 ends in the next 30 days with four backfills in play.' },
      { who: 'user', text: 'Is Devon a coaching problem?' },
      { who: 'assistant', text: 'Probably. Submittals at 17 against an expected 18 — the funnel is fine. Interviews at 12 and only four client meetings suggests the drop is in client-facing time, not sourcing.' },
    ],
  },

  // ── Greensboro — Administrative & Customer Support ───────────────────────
  {
    id: 'gso',
    name: 'Greensboro',
    specialty: 'Administrative & Customer Support',
    visitDate: 'Wed 9 Sep 2026',
    syncedAt: 'today 06:14',
    syncedTime: '06:14',
    benchmark: 22,
    expectations: { connects: 210, candidateVisits: 140, interviews: 18, submittals: 28, clientMeetings: 5 },
    rows: [
      ['Carla Jimenez', 'Practice Director, Sales', 'sales', '7 yr', 41, 18, 27, 11, 6, 5, 268, 0, 26, 44, 8, 5, 9],
      ['Ross Ellery', 'Practice Director, Sales', 'sales', '2 yr', 29, 22, 16, 5, 9, 2, 198, 0, 14, 23, 3, -24, -19],
      ['Nia Thompson', 'Recruiting Manager', 'recruiting', '8 yr', 44, 16, 29, 13, 5, 5, 254, 171, 31, 52, 7, 8, 12],
      ['Aaron Vogel', 'Recruiting Manager', 'recruiting', '4 yr', 36, 21, 21, 8, 8, 4, 221, 149, 22, 34, 5, -3, 2],
      ['Lena Petrov', 'Recruiter', 'recruiting', '3 yr', 38, 17, 24, 9, 6, 5, 236, 158, 25, 39, 6, 6, 7],
      ['Miles Redfern', 'Recruiter', 'recruiting', '1 yr', 24, 19, 15, 4, 7, 1, 189, 118, 15, 21, 3, -27, -21],
      ['Bijou Okonkwo', 'Recruiter', 'recruiting', '5 mo', 14, 11, 17, 3, 2, 1, 288, 132, 13, 24, 4, 46, 0, 'Rookie'],
    ],
    series: {
      close: series('Close ratio', '%', [23, 24, 23, 22, 24, 23, 22, 21, 21, 22, 22, 21], { priorRatio: 1.02, peerRatio: 1.06, seed: 31 }),
      active: series('Active JOs', '', [198, 209, 216, 211, 224, 231, 238, 234, 241, 247, 244, 226], { priorRatio: 0.95, peerRatio: 0.92, seed: 32 }),
      subs: series('Submittals', '', [214, 231, 219, 208, 246, 258, 266, 251, 238, 254, 246, 237], { priorRatio: 0.97, peerRatio: 0.94, seed: 33 }),
      starts: series('Starts', '', [44, 48, 43, 39, 51, 55, 58, 52, 47, 53, 50, 53], { priorRatio: 0.94, peerRatio: 0.91, seed: 34 }),
    },
    brief: {
      headline: 'Highest volume in the market and the only branch where conversion has fallen every quarter this year.',
      body: 'Greensboro runs 226 active JOs and 237 submittals, comfortably the busiest desk floor in the market, and 53 starts land in the next 30 days. Close ratio has gone 24% → 23% → 22% → 21% across the year against a 22% benchmark, and the branch is now a point under it. Volume is masking the drift: submittals per start have risen from 4.2 to 4.5 since January. Ross Ellery and Miles Redfern are both down more than 20% MoM and hold 41 open JOs between them. Seventeen of 43 upcoming ends have no backfill in play — the largest unbackfilled block in the market.',
    },
    actions: [
      { id: 'a1', title: 'Qualification review — Ross Ellery & Miles Redfern', body: 'Both under 17% on high submittal counts. Pull their last twenty closed reqs and read the fall-out point together.' },
      { id: 'a2', title: 'Backfill sweep — priority', body: 'Seventeen of 43 upcoming ends are unbackfilled, nine of them inside 14 days. This is the largest exposure in the market.' },
      { id: 'a3', title: 'Recognition — Nia Thompson', body: '52 submittals, 13 starts landing and a 29% close ratio on the highest-volume desk on the floor.' },
    ],
    askGreeting: 'Ask me anything about Greensboro — Active JOs, close ratio, activity and 12-month trend are loaded for all seven desks.',
    askPairs: [
      { question: 'Who slipped most this month?', answer: 'Miles Redfern: down 27% MoM at a 15% close ratio against a 22% benchmark, with seven upcoming ends and one backfill. Ross Ellery is close behind at 16% and down 24%.' },
      { question: 'Which open JOs are aging?', answer: 'Twenty-three open JOs are past 21 days with no submittal — the highest count in the market. Fourteen sit on Ross Ellery and Miles Redfern.' },
      { question: 'How does Greensboro compare to peers?', answer: 'Active JOs 226 against a peer average of 208, so volume leads the market. Close ratio 21% against 22% peer, and falling every quarter. Greensboro is winning work it is not converting.' },
      { question: 'What should I open the meeting with?', answer: 'Do not open on volume — they already know they are the busiest floor. Open on submittals per start: 4.5 now against 4.2 in January. That is the number that has moved.' },
    ],
    kpiCopy: {
      activeDelta: '−7% MoM', activeSub: 'peer avg 208', openDelta: '23 aged >21d', openSub: 'no submittal yet',
      closeDelta: '−1 pt vs peers', startsDelta: '+6% YoY', startsSub: 'next 30 days', endsSub: 'next 30 days',
      subsDelta: '−4% MoM', subsSub: 'trailing 30 days',
      openSpark: [141, 148, 152, 149, 156, 161], endsSpark: [37, 39, 42, 40, 44, 43],
    },
    mobileThread: [
      { who: 'assistant', text: 'Greensboro is the busiest floor in the market and the only one where conversion fell every quarter. Want the detail?' },
      { who: 'user', text: 'Yes' },
      { who: 'assistant', text: 'Close ratio 24% → 21% across the year. Submittals per start up from 4.2 to 4.5. Ross Ellery and Miles Redfern are both under 17% and down more than 20% MoM.' },
      { who: 'user', text: 'Is it a sourcing problem?' },
      { who: 'assistant', text: 'No — connects and CVs are both above expected on every desk. The work is going in. The fall-out is after submittal, which points at qualification or client fit, not activity.' },
    ],
  },

  // ── Charleston — Technology ──────────────────────────────────────────────
  {
    id: 'cha',
    name: 'Charleston',
    specialty: 'Technology',
    visitDate: 'Mon 14 Sep 2026',
    syncedAt: 'today 06:09',
    syncedTime: '06:09',
    benchmark: 19,
    expectations: { connects: 96, candidateVisits: 58, interviews: 10, submittals: 13, clientMeetings: 8 },
    rows: [
      ['Priyanka Nair', 'Practice Director, Sales', 'sales', '5 yr', 22, 9, 26, 4, 2, 2, 118, 0, 14, 18, 12, 11, 17],
      ['Cole Brennan', 'Practice Director, Sales', 'sales', '3 yr', 19, 13, 17, 2, 4, 1, 89, 0, 8, 11, 6, -11, -7],
      ['Sam Ortiz', 'Recruiting Manager', 'recruiting', '6 yr', 24, 10, 24, 5, 3, 3, 104, 71, 13, 17, 9, 6, 10],
      ['Tessa Lund', 'Recruiter', 'recruiting', '2 yr', 17, 12, 15, 2, 4, 1, 82, 49, 7, 10, 5, -19, -14],
      ['Andre Fontaine', 'Recruiter', 'recruiting', '4 yr', 21, 8, 22, 4, 2, 2, 97, 63, 11, 15, 8, 4, 6],
      ['Yuki Tanaka', 'Recruiter', 'recruiting', '6 mo', 8, 6, 13, 1, 1, 0, 131, 54, 6, 9, 4, 41, 0, 'Rookie'],
    ],
    series: {
      close: series('Close ratio', '%', [18, 19, 20, 21, 22, 21, 20, 19, 19, 20, 20, 20], { priorRatio: 0.93, peerRatio: 1.02, seed: 41 }),
      active: series('Active JOs', '', [88, 92, 97, 95, 101, 105, 109, 106, 110, 113, 111, 111], { priorRatio: 0.86, peerRatio: 1.12, seed: 42 }),
      subs: series('Submittals', '', [64, 71, 68, 62, 76, 81, 85, 79, 74, 80, 77, 80], { priorRatio: 0.88, peerRatio: 1.14, seed: 43 }),
      starts: series('Starts', '', [12, 14, 13, 11, 16, 17, 19, 16, 14, 17, 16, 18], { priorRatio: 0.85, peerRatio: 1.09, seed: 44 }),
    },
    brief: {
      headline: 'The smallest floor in the market, growing faster than any of them, and two desks short of the pipeline it has won.',
      body: 'Charleston runs 111 active JOs across six desks — up 26% year on year, the fastest growth in the market. Close ratio sits at 20%, a point over the 19% technology benchmark. The constraint is capacity, not conversion: 80 submittals against a peer average of 91 on comparable volume, and client meetings are running above expected on every sales desk while submittals lag. Cole Brennan and Tessa Lund are both below the benchmark and down double digits MoM. Yuki Tanaka is six months in and should be read on inputs for another two quarters.',
    },
    actions: [
      { id: 'a1', title: 'Headcount case — two recruiting desks', body: 'Assemble the twelve-month growth curve, submittal shortfall against peer, and the aged-JO list for the market headcount review.' },
      { id: 'a2', title: 'Coaching note — Tessa Lund', body: '15% close ratio and down 19% MoM on ten submittals. Connects are under expected too — this one starts at the top of the funnel.' },
      { id: 'a3', title: 'Recognition — Priyanka Nair', body: '26% close ratio against a 19% benchmark and twelve client meetings, the most on the floor.' },
    ],
    askGreeting: 'Ask me anything about Charleston — Active JOs, close ratio, activity and 12-month trend are loaded for all six desks.',
    askPairs: [
      { question: 'Who slipped most this month?', answer: 'Tessa Lund: down 19% MoM at a 15% close ratio against a 19% benchmark, with four upcoming ends and one backfill. Connects at 82 against an expected 96 — the shortfall starts at sourcing.' },
      { question: 'Which open JOs are aging?', answer: 'Nine open JOs are past 21 days with no submittal, out of 58 open. Five sit on Cole Brennan. Given six desks carrying 111 active JOs, this reads as capacity rather than neglect.' },
      { question: 'How does Charleston compare to peers?', answer: 'Active JOs 111 against a peer average of 99, and growing 26% year on year against a market average of 9%. Close ratio 20% against 19% peer. The gap is submittals: 80 against a peer 91.' },
      { question: 'What should I open the meeting with?', answer: 'Open with the growth number — 26% year on year is the best in the market and they will not have seen it framed that way. Then move to the headcount case, because that is what the visit is actually for.' },
    ],
    kpiCopy: {
      activeDelta: '+26% YoY', activeSub: 'peer avg 99', openDelta: '9 aged >21d', openSub: 'no submittal yet',
      closeDelta: '+1 pt vs peers', startsDelta: '+31% YoY', startsSub: 'next 30 days', endsSub: 'next 30 days',
      subsDelta: '+4% MoM', subsSub: 'trailing 30 days',
      openSpark: [44, 47, 51, 54, 56, 58], endsSpark: [11, 13, 14, 13, 15, 16],
    },
    mobileThread: [
      { who: 'assistant', text: 'Charleston is the fastest-growing branch in the market and short on capacity. Want the case?' },
      { who: 'user', text: 'Yes' },
      { who: 'assistant', text: 'Active JOs up 26% year on year across six desks. Submittals at 80 against a peer average of 91 on comparable volume. Nine JOs aged past 21 days with no submittal.' },
      { who: 'user', text: 'How many desks do they need?' },
      { who: 'assistant', text: 'Two recruiting desks closes the submittal gap at current conversion. A third would be needed if the growth curve holds through Q4 — the trend line says it will.' },
    ],
  },

  // ── Nashville — Finance & Accounting ─────────────────────────────────────
  {
    id: 'nas',
    name: 'Nashville',
    specialty: 'Finance & Accounting',
    visitDate: 'Thu 17 Sep 2026',
    syncedAt: 'today 06:11',
    syncedTime: '06:11',
    benchmark: 26,
    rows: [
      ['Vaughn Alder', 'Practice Director, Sales', 'sales', '12 yr', 36, 13, 35, 8, 4, 4, 189, 0, 24, 34, 12, 4, 8],
      ['Simone Nakamura', 'Practice Director, Sales', 'sales', '6 yr', 31, 16, 30, 6, 5, 4, 171, 0, 19, 27, 9, 6, 9],
      ['Doug Fairbanks', 'Practice Director, Sales', 'sales', '9 yr', 29, 18, 23, 5, 6, 2, 126, 0, 13, 19, 5, -9, -11],
      ['Keisha Mbeki', 'Practice Director, Sales', 'sales', '2 yr', 21, 14, 25, 4, 3, 3, 163, 0, 14, 21, 8, 13, 19],
      ['Rafael Ochoa', 'Recruiting Manager', 'recruiting', '7 yr', 34, 15, 32, 7, 4, 4, 168, 121, 26, 39, 10, 5, 7],
      ['Bridget Kowal', 'Recruiting Manager', 'recruiting', '4 yr', 27, 19, 22, 4, 7, 3, 139, 88, 15, 23, 6, -12, -8],
      ['Emmett Shaw', 'Recruiter', 'recruiting', '5 yr', 30, 12, 29, 6, 3, 3, 152, 108, 21, 33, 8, 7, 10],
      ['Lucia Ferrante', 'Recruiter', 'recruiting', '3 yr', 25, 17, 24, 4, 5, 2, 144, 94, 17, 26, 7, 2, 4],
      ['Trevor Nkemelu', 'Recruiter', 'recruiting', '1 yr', 16, 13, 19, 3, 4, 1, 178, 82, 11, 16, 5, -22, 6],
      ['Hannah Reyes', 'Recruiter', 'recruiting', '9 mo', 13, 10, 21, 2, 2, 1, 191, 99, 10, 17, 6, 29, 37, 'Ramping'],
    ],
    series: {
      close: series('Close ratio', '%', [27, 28, 27, 28, 29, 28, 27, 26, 26, 27, 27, 26], { priorRatio: 0.96, peerRatio: 0.99, seed: 51 }),
      active: series('Active JOs', '', [231, 238, 244, 241, 251, 258, 264, 259, 266, 271, 268, 262], { priorRatio: 0.93, peerRatio: 0.88, seed: 52 }),
      subs: series('Submittals', '', [218, 234, 221, 213, 248, 259, 266, 254, 241, 253, 248, 255], { priorRatio: 0.94, peerRatio: 0.9, seed: 53 }),
      starts: series('Starts', '', [38, 42, 39, 35, 45, 48, 51, 47, 42, 47, 45, 49], { priorRatio: 0.92, peerRatio: 0.87, seed: 54 }),
    },
    brief: {
      headline: 'The biggest floor in the market, holding a 26% close ratio across ten desks — the spread between desks is the story.',
      body: 'Nashville runs 262 active JOs and 255 submittals across ten desks, and 49 starts land in the next 30 days. Close ratio is 26%, exactly on benchmark and a point over peer. But the spread runs from Vaughn Alder at 35% to Trevor Nkemelu at 19% — sixteen points, the widest in the market. Three desks sit below benchmark and hold 50 open JOs between them. Bridget Kowal is down 12% MoM with seven upcoming ends against three backfills. Hannah Reyes is nine months in and climbing 29% MoM.',
    },
    actions: [
      { id: 'a1', title: 'Close the desk spread', body: 'Sixteen points between the best and worst desk. Propose a monthly qualification clinic led by Vaughn Alder and Rafael Ochoa.' },
      { id: 'a2', title: 'Coaching note — Bridget Kowal', body: 'Down 12% MoM at 22% with seven upcoming ends and three backfills. Largest single exposure on the floor.' },
      { id: 'a3', title: 'Recognition — Vaughn Alder', body: '35% close ratio on 34 submittals over twelve years. Ask him to run the first qualification clinic.' },
    ],
    askGreeting: 'Ask me anything about Nashville — Active JOs, close ratio, activity and 12-month trend are loaded for all ten desks.',
    askPairs: [
      { question: 'Who slipped most this month?', answer: 'Trevor Nkemelu: down 22% MoM at a 19% close ratio against a 26% benchmark. Bridget Kowal is second, down 12% at 22% with seven upcoming ends and three backfills in play.' },
      { question: 'Which open JOs are aging?', answer: 'Fourteen open JOs are past 21 days with no submittal. Nine sit on Doug Fairbanks and Bridget Kowal. Trevor Nkemelu holds three that are aged but have interviews booked.' },
      { question: 'How does Nashville compare to peers?', answer: 'Active JOs 262 against a peer average of 231, the largest floor in the market. Close ratio 26% against a 25% peer average. Nashville is ahead on both — the internal spread is the exposure, not the market position.' },
      { question: 'What should I open the meeting with?', answer: 'Open on the spread, not the average. The branch average of 26% is healthy and hides sixteen points between the top and bottom desk. That is the number worth an hour of the visit.' },
    ],
    kpiCopy: {
      activeDelta: '−2% MoM', activeSub: 'peer avg 231', openDelta: '14 aged >21d', openSub: 'no submittal yet',
      closeDelta: '+1 pt vs peers', startsDelta: '+11% YoY', startsSub: 'next 30 days', endsSub: 'next 30 days',
      subsDelta: '+3% MoM', subsSub: 'trailing 30 days',
      openSpark: [151, 148, 152, 147, 145, 147], endsSpark: [39, 41, 44, 42, 45, 43],
    },
    mobileThread: [
      { who: 'assistant', text: 'Nashville sits exactly on benchmark. The spread between desks is where the risk is. Want it?' },
      { who: 'user', text: 'Yes' },
      { who: 'assistant', text: 'Vaughn Alder at 35% down to Trevor Nkemelu at 19% — sixteen points, the widest in the market. Three desks below benchmark hold 50 open JOs between them.' },
      { who: 'user', text: 'Who do I spend the visit with?' },
      { who: 'assistant', text: 'Bridget Kowal. Seven upcoming ends against three backfills is the biggest single exposure on the floor, and she is down 12% MoM on top of it.' },
    ],
  },

  // ── Atlanta North — Technology ───────────────────────────────────────────
  {
    id: 'atl',
    name: 'Atlanta North',
    specialty: 'Technology',
    visitDate: 'Tue 22 Sep 2026',
    syncedAt: 'today 06:15',
    syncedTime: '06:15',
    benchmark: 19,
    expectations: { connects: 96, candidateVisits: 58, interviews: 10, submittals: 13, clientMeetings: 8 },
    rows: [
      ['Garrett Hollis', 'Practice Director, Sales', 'sales', '8 yr', 28, 11, 25, 5, 3, 3, 124, 0, 16, 21, 13, 6, 11],
      ['Anjali Desai', 'Practice Director, Sales', 'sales', '5 yr', 25, 14, 22, 4, 4, 3, 111, 0, 13, 17, 10, 3, 7],
      ['Bruno Sandoval', 'Practice Director, Sales', 'sales', '2 yr', 19, 16, 14, 2, 5, 1, 87, 0, 7, 10, 5, -26, -18],
      ['Meredith Vance', 'Recruiting Manager', 'recruiting', '9 yr', 31, 12, 27, 6, 3, 3, 118, 84, 17, 24, 11, 8, 13],
      ['Kwame Asante', 'Recruiting Manager', 'recruiting', '3 yr', 23, 17, 18, 3, 5, 2, 94, 61, 10, 14, 6, -8, -4],
      ['Sloane Whitaker', 'Recruiter', 'recruiting', '6 yr', 27, 10, 24, 5, 2, 2, 108, 76, 14, 20, 9, 5, 8],
      ['Felix Duran', 'Recruiter', 'recruiting', '4 yr', 22, 13, 20, 4, 3, 2, 99, 67, 12, 16, 7, 1, 3],
      ['Imani Cross', 'Recruiter', 'recruiting', '2 yr', 18, 15, 16, 2, 4, 1, 79, 44, 8, 11, 4, -23, -17],
      ['Nolan Reyes', 'Recruiter', 'recruiting', '7 mo', 10, 8, 15, 1, 1, 1, 142, 61, 7, 12, 5, 44, 0, 'Rookie'],
    ],
    series: {
      close: series('Close ratio', '%', [21, 22, 21, 22, 23, 22, 21, 20, 20, 21, 21, 20], { priorRatio: 0.97, peerRatio: 0.95, seed: 61 }),
      active: series('Active JOs', '', [186, 191, 197, 193, 202, 208, 213, 209, 214, 218, 215, 203], { priorRatio: 0.91, peerRatio: 0.86, seed: 62 }),
      subs: series('Submittals', '', [128, 137, 131, 124, 146, 153, 158, 149, 141, 149, 145, 145], { priorRatio: 0.93, peerRatio: 0.89, seed: 63 }),
      starts: series('Starts', '', [26, 29, 27, 24, 31, 34, 36, 32, 29, 33, 31, 32], { priorRatio: 0.9, peerRatio: 0.85, seed: 64 }),
    },
    brief: {
      headline: 'A point above the technology benchmark on paper, and three desks are carrying the whole margin.',
      body: 'Atlanta North holds 203 active JOs across nine desks and a 20% close ratio, a point over the 19% technology benchmark and level with peer. Below the average the floor splits cleanly: Garrett Hollis, Meredith Vance and Sloane Whitaker all sit at 24% or better; Bruno Sandoval, Imani Cross and Nolan Reyes all sit at 16% or worse. Bruno and Imani are down 26% and 23% MoM respectively and hold 31 open JOs between them. Twelve of 30 upcoming ends have no backfill in play. Active JOs fell 6% this month, the first decline since January.',
    },
    actions: [
      { id: 'a1', title: 'Coaching note — Bruno Sandoval', body: 'Down 26% MoM at 14% against a 19% benchmark. Connects at 87 against an expected 96 — this starts at activity, not qualification.' },
      { id: 'a2', title: 'Backfill sweep', body: 'Twelve of 30 upcoming ends are unbackfilled, seven of them on the three desks below benchmark.' },
      { id: 'a3', title: 'Watch item — active JO decline', body: 'First month-on-month fall since January, down 6%. Pull the new-business pipeline before the visit to see whether it is demand or capacity.' },
    ],
    askGreeting: 'Ask me anything about Atlanta North — Active JOs, close ratio, activity and 12-month trend are loaded for all nine desks.',
    askPairs: [
      { question: 'Who slipped most this month?', answer: 'Bruno Sandoval: down 26% MoM at a 14% close ratio against a 19% benchmark, with five upcoming ends and one backfill. Imani Cross is second, down 23% at 16%.' },
      { question: 'Which open JOs are aging?', answer: 'Sixteen open JOs are past 21 days with no submittal. Nine sit on Bruno Sandoval and Imani Cross, both of whom are also under expected on connects.' },
      { question: 'How does Atlanta North compare to peers?', answer: 'Active JOs 203 against a peer average of 189. Close ratio 20% against 20% peer — level. But active JOs fell 6% this month while the peer average rose 2%, which is the first divergence this year.' },
      { question: 'What should I open the meeting with?', answer: 'Open on the active JO decline. It is one month and small, but it is the first since January and it will not be in anyone else’s report yet. Then move to the three desks under 17%.' },
    ],
    kpiCopy: {
      activeDelta: '−6% MoM', activeSub: 'peer avg 189', openDelta: '16 aged >21d', openSub: 'no submittal yet',
      closeDelta: 'level vs peers', startsDelta: '+9% YoY', startsSub: 'next 30 days', endsSub: 'next 30 days',
      subsDelta: '−1% MoM', subsSub: 'trailing 30 days',
      openSpark: [104, 108, 112, 111, 115, 116], endsSpark: [24, 26, 28, 27, 30, 30],
    },
    mobileThread: [
      { who: 'assistant', text: 'Atlanta North is a point over benchmark with three desks carrying it. Want the split?' },
      { who: 'user', text: 'Yes' },
      { who: 'assistant', text: 'Hollis, Vance and Whitaker are all 24% or better. Sandoval, Cross and Reyes are all 16% or worse. Nothing sits in the middle — it is a clean split, not a gradient.' },
      { who: 'user', text: 'What about the JO drop?' },
      { who: 'assistant', text: 'Active JOs down 6% this month, first fall since January, while peers rose 2%. Too early to call demand, but worth pulling the new-business pipeline before Tuesday.' },
    ],
  },

  // ── Birmingham — Legal ───────────────────────────────────────────────────
  {
    id: 'bhm',
    name: 'Birmingham',
    specialty: 'Legal',
    visitDate: 'Fri 25 Sep 2026',
    syncedAt: 'today 06:08',
    syncedTime: '06:08',
    benchmark: 24,
    expectations: { connects: 74, candidateVisits: 46, interviews: 8, submittals: 10, clientMeetings: 9 },
    rows: [
      ['Eleanor Whitcombe', 'Practice Director, Sales', 'sales', '14 yr', 19, 6, 33, 4, 2, 2, 88, 0, 12, 15, 14, 5, 9],
      ['Desmond Blaylock', 'Practice Director, Sales', 'sales', '7 yr', 16, 9, 26, 3, 2, 2, 79, 0, 9, 11, 11, 2, 4],
      ['Farrah Nazari', 'Recruiting Manager', 'recruiting', '10 yr', 18, 7, 29, 3, 2, 2, 81, 52, 10, 13, 10, 7, 11],
      ['Colin Ashworth', 'Recruiter', 'recruiting', '3 yr', 14, 11, 18, 2, 4, 1, 62, 38, 6, 8, 6, -21, -15],
      ['Marisol Vega', 'Recruiter', 'recruiting', '11 mo', 9, 7, 20, 1, 1, 1, 96, 44, 7, 10, 7, 27, 34, 'Ramping'],
    ],
    series: {
      close: series('Close ratio', '%', [24, 25, 26, 27, 27, 26, 26, 25, 25, 26, 26, 25], { priorRatio: 0.95, peerRatio: 0.97, seed: 71 }),
      active: series('Active JOs', '', [61, 64, 67, 65, 69, 71, 74, 72, 74, 76, 75, 76], { priorRatio: 0.92, peerRatio: 1.18, seed: 72 }),
      subs: series('Submittals', '', [44, 48, 46, 43, 51, 54, 56, 52, 49, 54, 52, 57], { priorRatio: 0.9, peerRatio: 1.21, seed: 73 }),
      starts: series('Starts', '', [9, 11, 10, 8, 12, 13, 14, 12, 11, 13, 12, 13], { priorRatio: 0.88, peerRatio: 1.15, seed: 74 }),
    },
    brief: {
      headline: 'Smallest floor in the market, best conversion in the market, and one desk away from a real problem.',
      body: 'Birmingham runs 76 active JOs across five desks with a 25% close ratio, a point over the 24% legal benchmark and the best conversion of any branch. Client meetings run above expected on all five desks — this is a relationship floor and it behaves like one. The exposure is concentration: Eleanor Whitcombe alone holds a third of the active JOs and 33% conversion, and there is no second sales desk of comparable depth. Colin Ashworth is the one desk below benchmark, down 21% MoM at 18% with four upcoming ends and one backfill. Marisol Vega is eleven months in and up 27%.',
    },
    actions: [
      { id: 'a1', title: 'Succession risk — Eleanor Whitcombe', body: 'One desk holds a third of the branch’s active JOs at fourteen years tenure. Start the depth conversation now, not at renewal.' },
      { id: 'a2', title: 'Coaching note — Colin Ashworth', body: 'Down 21% MoM at 18% against a 24% benchmark. Connects at 62 against an expected 74 — activity first, then qualification.' },
      { id: 'a3', title: 'Recognition — Farrah Nazari', body: '29% close ratio and ten client meetings on a recruiting desk. Ten years in and still the second-best converter on the floor.' },
    ],
    askGreeting: 'Ask me anything about Birmingham — Active JOs, close ratio, activity and 12-month trend are loaded for all five desks.',
    askPairs: [
      { question: 'Who slipped most this month?', answer: 'Colin Ashworth, and he is the only desk that slipped: down 21% MoM at 18% against a 24% benchmark, with four upcoming ends and one backfill. The other four desks are all up.' },
      { question: 'Which open JOs are aging?', answer: 'Four open JOs are past 21 days with no submittal, out of 40 open — the cleanest aged-JO position in the market. Three of the four sit on Colin Ashworth.' },
      { question: 'How does Birmingham compare to peers?', answer: 'Active JOs 76 against a peer average of 90, so it is under-scaled. But close ratio is 25% against a 24% peer average and the highest of any branch. Birmingham converts better than anyone and does less of it.' },
      { question: 'What should I open the meeting with?', answer: 'Open with the conversion number — 25% is the best in the market and they should hear it said out loud. Then move to concentration, because one desk holding a third of the floor is the real agenda item.' },
    ],
    kpiCopy: {
      activeDelta: '+1% MoM', activeSub: 'peer avg 90', openDelta: '4 aged >21d', openSub: 'no submittal yet',
      closeDelta: '+1 pt vs peers', startsDelta: '+18% YoY', startsSub: 'next 30 days', endsSub: 'next 30 days',
      subsDelta: '+10% MoM', subsSub: 'trailing 30 days',
      openSpark: [46, 44, 43, 41, 40, 40], endsSpark: [9, 10, 12, 11, 11, 11],
    },
    mobileThread: [
      { who: 'assistant', text: 'Birmingham has the best conversion in the market and a concentration problem. Want the detail?' },
      { who: 'user', text: 'Yes' },
      { who: 'assistant', text: 'Close ratio 25% against a 24% benchmark, best of any branch. But Eleanor Whitcombe holds 19 of 76 active JOs at 33% conversion, and no other sales desk comes close.' },
      { who: 'user', text: 'What happens if she leaves?' },
      { who: 'assistant', text: 'A third of the active pipeline moves to desks converting eight points lower. On current numbers that is roughly four starts a quarter. Worth a depth plan before renewal season.' },
    ],
  },
];

# Dario Mongardini — Developer portfolio

Live: https://mx101001.github.io/

Static HTML, CSS and JavaScript. No build tool or frontend dependencies. The existing GitHub Pages source (`main`, repository root) publishes the portfolio. The validation workflow checks the automaton logic and local links.

## Local use

Run `python3 -m http.server 8000`, then open http://localhost:8000. ES modules need HTTP; do not open the HTML via file://.

Run `node --test scripts/life.test.mjs` and `python3 scripts/check_site.py` for checks.

## Content provenance

Editorial snapshot: 6 June – 6 September 2026, public repositories visible on mx101001. Repository search for pushes in the period returned `ioccc-glider-cannon` and `ekos-style-landing`. Their default-branch histories contained 2 and 17 commits in the interval respectively. The EKOS history contains bot-authored/co-authored commits; these are not presented as 17 manually written contributions. Older repositories are not presented as recent work. No private organization work was available in this connection.

- C project: `mx101001/ioccc-glider-cannon`, commit `1b13da396fd45e4bb05caefdf391ac389c90cb19`, readable implementation, Makefile and README.
- EKOS: `mx101001/ekos-style-landing`, route `src/routes/index.tsx`, commits `e25506711eb7c6f32480493c689d52acba35a17a`, `84228ce927f99be69f02fd986c040b3d080be1cb`, `f5e31507553e3a3f576e9b3467a27c1b37fb988b`.
- The WordPress conversion is a recorded request, not claimed as a completed theme.
- Repository validation targets are described as existing code; this portfolio does not claim an independent audit or a successful IOCCC submission.

## Interaction

The browser Game of Life is a new JavaScript implementation of Conway B3/S23, seeded with the standard Gosper glider gun. It is not a compiled reproduction of the C source. It uses an 80×40 torus, while the original uses 80×24. Starts paused; mouse/touch painting, keyboard editing, stepping, speed, reset and clear are supported. Animation pauses when the tab is hidden.

## Editing

Content: `index.html`. Style: `assets/portfolio.css`. Interaction: `assets/portfolio.js`. Automaton: `assets/life-engine.mjs`. Update the snapshot date when reviewing newer work. Fonts use Google Fonts with local system fallbacks; no analytics or cookies are included.

The original blog routes are preserved. The new portfolio replaces the root homepage without rewriting Git history.

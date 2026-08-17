# Projects section: compact carousel and search

Date: 2026-08-17

## Problem

The home page's Projects section renders three full-size cards in a grid and
sends everyone else to `/projects`. Three problems follow from that:

- The cards are tall enough that the section is close to a full viewport for
  three items. Descriptions run to seven lines and the tag row wraps.
- Only three of eleven projects are reachable without a route change. Four of
  the seven featured projects are invisible on the home page.
- There is no way to look for a project. `/projects` filters by status only,
  which does not help someone who wants "the Go one" or "the React Native
  ones".

## Outcome

- The section becomes a horizontally scrolling carousel of the seven featured
  projects, four per view, followed by a "see all" card that links to
  `/projects`.
- Cards shrink to 262px: a shorter image strip, a three-line description
  clamp, and at most three tags.
- A search input above the rail filters across **all eleven** projects. A
  non-empty query replaces the carousel with a result grid.
- `/projects` is unchanged, and keeps its full-size cards, status filters,
  sitemap entry, OG card and ⌘K entry.

## Decisions taken during design

These were settled by mockup and measurement, and the reasoning matters more
than the outcome:

**Featured-only carousel, search over everything.** The rail holds the seven
featured projects so the section keeps its "Featured Projects" framing. Search
deliberately reaches all eleven, because a search that cannot find the private
university project or the in-progress one is a decoration. The result count
(`3 of 11 projects`) makes the wider scope visible.

**No status pills on the home page.** All seven featured projects are `live`,
so pills over the rail would be three permanently empty buttons. `/projects`
already has them, over a set where they mean something.

**No hover-to-expand on the description.** The first mockup expanded the
hovered card's clamp from two lines to six. Only the hovered card gained text,
but the rail stretches every card to a common height, so all eight grew 71px
and the page below shifted down. Taking the hovered card out of flow fixes the
reflow, but the expanded card is then clipped 65px below the rail, because
`overflow-x: auto` forces `overflow-y: auto` on the same element. Reserving
that space with padding puts the resting section at 316px — measured at the
two-line clamp, the same height as letting it reflow. The expand cannot be
made free inside a horizontal scroller, so it is gone. Hover reveals the links overlay only, and card height
never changes.

**Three-line clamp, not two.** Measured at 244px for two lines and 262px for
three. Three lines is worth the 18px because most descriptions reach a natural
break rather than stopping mid-sentence.

## Architecture

`Projects.tsx` becomes a thin orchestrator: it owns the query string and
decides between the carousel and the result grid. The rail and the search
input become their own components, neither of which knows about the other.

| File | Change |
| --- | --- |
| `src/components/ProjectSearch.tsx` | new — terminal-styled input, clear button, result count |
| `src/components/ProjectCarousel.tsx` | new — scroll-snap rail, arrows, dots, trailing see-all card |
| `src/components/Projects.tsx` | rewritten — holds query state, switches carousel/grid |
| `src/components/ProjectCard.tsx` | gains `variant?: "compact" \| "full"`, default `"full"` |
| `src/lib/search.ts` | new — `queryTokens`, `wordsOf`, `fieldScore` lifted out of `bookmarks.ts` |
| `src/lib/projects.ts` | gains `searchProjects` |
| `src/lib/bookmarks.ts` | imports the three helpers instead of declaring them |

### Data flow

```
projects ─┬─> featured (filter) ──> ProjectCarousel ──> ProjectCard variant="compact"
          │                                        └──> see-all card ──> /projects
          └─> searchProjects(query) ──> result grid ──> ProjectCard variant="compact"

ProjectSearch ──(query)──> Projects ──(decides which branch renders)
```

`Projects` holds one piece of state, the trimmed query string. Empty query
means carousel; anything else means grid. `ProjectCarousel` owns its own
scroll position and derives its arrows and dots from it; nothing outside reads
that.

## Components

### `ProjectCard` — the `compact` variant

`variant` defaults to `"full"`, so `/projects` and `ProjectsShowcase` are
untouched by the prop's arrival. The compact variant differs only in
dimensions and how much it shows:

| | full | compact |
| --- | --- | --- |
| image strip | 192px | 128px |
| description | unclamped | 3 lines |
| tags | all | first 3, then `+N` |
| resting height | ~530px | 262px |

Badges, the hover links overlay, the mobile inline links, the private
"available on request" line and the placeholder treatments are shared and
behave identically in both.

**The clamp needs a wrapper element.** `-webkit-line-clamp` requires
`display: -webkit-box`, and a flex item is blockified — the computed display
comes back as `flow-root` and the clamp silently does nothing. The card body
is a flex column, so the clamped paragraph cannot itself be the flex child.
Tailwind's `line-clamp-3` fails the same way for the same reason. Wrap it:

```tsx
<div className="flex-1">
  <p className="line-clamp-3 …">{project.description}</p>
</div>
```

### `ProjectCarousel`

Native CSS scroll-snap, no carousel library. The rail is
`overflow-x-auto snap-x snap-mandatory` with the scrollbar hidden; each cell is
`snap-start` and sized by flex-basis:

| breakpoint | per view |
| --- | --- |
| `lg` and up | 4 |
| `md` | 2 |
| below `md` | 1, with the next card peeking |

Arrows are real buttons calling `scrollBy({ left: clientWidth })` and are
disabled at each end. The active dot is `round(scrollLeft / clientWidth)`,
recomputed from a scroll listener through `requestAnimationFrame`. Dots are
buttons, not decoration. No autoplay.

The trailing see-all card must stay within the height of a project card. In
the mockup it was 367px against the cards' 244px, and because the rail
stretches every item to the tallest, it silently dragged all seven cards up
with it — undoing the entire point of the compact variant. Keep its content to
the prompt line, a heading, one line of prose and the link.

### `ProjectSearch`

A controlled input styled as a terminal prompt: a green `$ grep projects`
prefix, a blinking block caret that hides on focus, and a clear button that
appears only when the query is non-empty. Use `type="text"`, not
`type="search"` — the latter renders a native clear affordance that sits
beside ours.

Below it, the result count renders only when a query is active, in a
fixed-height element so that typing does not shift the rail.

### `searchProjects` and `lib/search.ts`

The same token-based approach as bookmarks: the query is split on
non-alphanumerics and **every** token must match a word in some field, so
`react n` finds React Native. Tokens score exact word > word prefix > infix,
weighted by field, and hits are ranked by total score with the original order
as the tie-break.

| field | weight |
| --- | --- |
| title | 4 |
| tags | 3 |
| status | 2 |
| description | 1 |

`queryTokens`, `wordsOf` and `fieldScore` are currently private to
`bookmarks.ts`. They move to `lib/search.ts` unchanged and both modules import
them; each keeps its own field weights and indexing. No behaviour change to
bookmark search is intended, and its ranking must come out identical.

Matches are not highlighted. Bookmarks highlights because its rows are dense
and text-only; a card already carries an image and a title.

## Edge cases

- **No matches** — the grid is replaced by a centred line naming the query.
  The carousel is not shown; clearing the query brings it back.
- **Clearing the query** — the carousel returns with its scroll position reset
  to the start, so the arrows and dots agree with what is on screen.
- **Fewer than four featured projects** — the rail renders a short row rather
  than stretching cards; the arrows disable and the dots collapse to one.
- **A project with no image** — the existing placeholder treatments are reused
  at the shorter height.

## Risks

- **Lenis owns vertical smooth scroll.** It should leave a horizontal scroller
  alone, but trackpad horizontal gestures over the rail need checking in a
  browser rather than assuming.
- **Image `priority`.** `ProjectCard` sets `priority={project.featured}`,
  which currently preloads three images. A featured carousel would make that
  seven preloads above the fold. The compact variant must take `priority` from
  its position in the rail, not from `featured`, and only the first four
  qualify.
- **`useIsMobile` drives the links treatment.** The compact card inherits it
  unchanged; the hover overlay must stay suppressed on touch, where there is
  no hover to reveal it.

## Out of scope

- A `tagline` field on `Project` so cards carry purpose-written copy instead
  of a truncated description. This is the better long-term fix for
  truncation, but it changes `portfolio.json`, `PortfolioConfig` and
  `portfolio-schema.ts`, and belongs in its own change.
- Any change to `/projects`, its filters, or its card size.
- Highlighting matched terms in results.

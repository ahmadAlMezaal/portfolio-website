# Contact section: message modal and a filled left column

Date: 2026-08-02

## Problem

The Contact section is a two-column grid. The right column is a long inline
form; the left column holds a location card, an email reveal card and three
social icons, and then stops — leaving roughly 300px of empty space beside the
form's lower half. The form also dominates a section whose real job is to
offer several ways to make contact, and `Contact.tsx` has grown to 283 lines
because the form's state, the info cards and the socials all live in one file.

## Outcome

- The message form moves into a modal, opened from a CTA in the section and
  from the ⌘K palette.
- "Book a Chat" stays visible in the section, as a peer of the new CTA.
- The left column is filled with an availability panel and a set of
  "what I can help with" chips.
- `Contact.tsx` is left holding only the section's layout.

Submission behaviour does not change: the site is a static export with no
backend, so the form still builds a `mailto:` URL with an encoded subject and
body and hands off to the visitor's mail client.

## Architecture

The modal must open from ⌘K on any route, but `Contact` renders on the home
page only. The modal therefore becomes global chrome in `layout.tsx`, beside
`ShortcutsOverlay`, and is opened through `shortcutsBus` — the existing
convention for one component opening another.

| File | Change |
| --- | --- |
| `src/components/ContactModal.tsx` | new — the form lifted out of `Contact`, rendered once in the layout |
| `src/components/AvailabilityPanel.tsx` | new — the `$ status --now` block and the live clock |
| `src/components/shortcutsBus.ts` | add `openContactModal` / `onOpenContactModal` |
| `src/components/Contact.tsx` | form removed; left column gains two blocks; right column becomes a CTA card |
| `src/components/CommandPalette.tsx` | new `action-message` entry in the Actions group |
| `src/app/layout.tsx` | render `<ContactModal />` |
| `src/types/index.ts` | `timezone?: string` on `PersonalInfo` |
| `scripts/portfolio-schema.ts` | matching optional `timezone` |
| `src/lib/data.config.example.ts` | `timezone` and `knowsAbout` filled in |

### Data flow

```
personalInfo ──> Contact ──> AvailabilityPanel  (status, location, timezone)
             └─> Contact ──> chips              (knowsAbout)
             └─> ContactModal                   (email, name)

Contact CTA ─────┐
                 ├─> openContactModal() ─> ContactModal opens
CommandPalette ──┘
```

`ContactModal` owns its own open state and form state. Nothing else reads
either; the bus carries no payload, only the intent to open.

## Section layout

The two-column grid stays, and keeps its default stretch alignment so the
right-hand card's `h-full` resolves against the taller left column.

### Left column

Unchanged: the location card, the email card (click to reveal, click again to
copy — it serves the visitor who wants the raw address for their own client,
which is a different need from composing, and the masking is the anti-scraping
measure), and the row of social icons.

Added beneath, in order:

1. **Availability panel** — a terminal-style block:

   ```
   $ status --now
   ● Open to Freelance
     London, United Kingdom · 14:32 local · GMT+1
   ```

   The dot pulses and takes its colour from `--accent-rgb` so it recolours per
   palette. Status and location come from `personalInfo`. The time and offset
   render only when `personalInfo.timezone` is set; without it the line is
   location alone.

2. **"What I can help with"** — chips from `personalInfo.knowsAbout`. The
   block returns `null` when the field is absent or empty, so a fresh clone
   does not render a heading over nothing.

### Right column

One card, `h-full`, content top-aligned:

- `MessageSquare` icon and the heading "Start a conversation"
- One line of supporting copy stating that the form opens the visitor's mail
  client with the details filled in
- Primary button: "Send me a Message", opens the modal
- Secondary link: "Book a Chat", unchanged, still rendered only when
  `personalInfo.bookingUrl` is set
- A `$ awaiting input_` prompt line with a blinking cursor pinned to the
  bottom, so the card fills its height rather than floating short beside the
  taller left column

## ContactModal

Built on the pattern `ShortcutsOverlay` already establishes:

- `AnimatePresence` with the same 0.15s opacity/scale transitions
- Backdrop `bg-black/50 backdrop-blur-sm`, click to close
- `data-lenis-prevent` and a passive-false `wheel` listener while open
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title
- Escape closes

Beyond that pattern:

- Focus moves to the name field when the modal opens
- Focus returns to the element that opened it when it closes
- Tab is trapped within the dialog while it is open

Contents are today's form unchanged — name, email and message fields, and the
"Open Email Client" submit button with its `DecodeText` glitch — under a
header bar reading `$ compose`. Submitting closes the modal and navigates to
the `mailto:` URL.

## Command palette

One new command in the **Actions** group:

```
id: "action-message"
label: "Send a message"
perform: () => openContactModal()
```

It sits beside the existing `action-copy-email`, which stays.

## Config

Two optional fields, both degrading to nothing when absent:

- **`personalInfo.timezone?: string`** — an IANA identifier such as
  `"Europe/London"`. New. Drives the clock and offset in the availability
  panel. Added to `PersonalInfo`, to the zod schema in
  `scripts/portfolio-schema.ts`, and to `data.config.example.ts`.
- **`personalInfo.knowsAbout?: string[]`** — already declared on
  `PersonalInfo` and already read by the Person schema in `JsonLd`, but absent
  from the live `portfolio.json`. This design adds its first UI consumer. The
  live data is updated separately, in the private `portfolio-data` repo;
  until then the chips block renders nothing and the rest of the section is
  unaffected.

`SchemaMatchesPortfolioConfig` at the foot of the schema keeps the two
declarations honest — adding `timezone` to one and not the other fails the
build.

## Hydration

A live clock in a prerendered page is a hydration mismatch by construction:
the server renders one time, the client another. The time is read through
`useSyncExternalStore` with a server snapshot of `null`, so the prerendered
HTML contains no time at all and the clock appears after mount. This also
avoids adding to the standing `react-hooks/set-state-in-effect` lint baseline,
which a `useEffect` + `setState` interval would do.

The subscribe function registers a one-second interval; the snapshot is a
rounded-to-the-minute timestamp so the store only notifies when the displayed
value would actually change.

## Theming

Both new blocks use `rgb(var(--accent-rgb) / …)` for accent colour rather than
a Tailwind colour family. The remap covers only some shades of some families —
`purple` and `emerald` have a usable `bg-*-900` / `text-*-400` pair, the others
do not — so a chip built as `bg-blue-900/30 text-blue-400` would leak literal
blue into the amber and cyberpunk palettes.

## Accessibility

- The dialog is labelled, modal, focus-trapped, and restores focus on close
- The status dot is decorative; the status text carries the meaning
- The pulse and the blinking cursor are suppressed under
  `prefers-reduced-motion`, via the existing `useShouldReduceMotion` hook
- The CTA is a `<button>` with `aria-haspopup="dialog"`

## Out of scope

- Replacing `mailto:` with a form service. It would need a third-party
  endpoint and a network call from a static site; nothing in this change
  depends on it, and the current behaviour is unchanged.
- Any navbar entry for the modal. The nav row already carries links, the
  status pill, the bookmarks star and the mobile menu.
- Editing the private `portfolio-data` repo. `knowsAbout` and `timezone` are
  read if present; populating them is a separate, manual step.

## Verification

- `pnpm build` succeeds, including the `SchemaMatchesPortfolioConfig` check
- `pnpm lint` reports no new errors beyond the standing
  `react-hooks/set-state-in-effect` baseline
- The prerendered `out/index.html` contains the status line and no clock
- The modal opens from the section CTA and from ⌘K, closes on Escape, on
  backdrop click and on submit, and returns focus to its trigger
- All three palettes render the new blocks in their own accent colour

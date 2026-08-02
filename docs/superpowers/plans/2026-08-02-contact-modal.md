# Contact Message Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the inline contact form into a globally-mounted modal opened from the Contact section and the ⌘K palette, and fill the empty left column with an availability panel and topic chips.

**Architecture:** The modal is global chrome rendered once in `app/layout.tsx` and opened by a custom window event through the existing `shortcutsBus`, because ⌘K works on routes where `Contact` is not mounted. `Contact` keeps only layout: two columns, info blocks on the left, a CTA card on the right. Two optional config fields (`personalInfo.timezone`, `personalInfo.knowsAbout`) drive the new left-column blocks and each renders nothing when absent.

**Tech Stack:** Next.js 16 (App Router, `output: "export"`), React 19, TypeScript 6, Tailwind CSS 4, Motion 12 (`motion/react`), lucide-react 0.x, zod 4 (build scripts only).

## Global Constraints

Every task's requirements implicitly include this section.

- **No comments.** Not in `.ts`, `.tsx`, `.css`, `.mjs`, `.js`, or workflow YAML. The only exceptions are lint/compiler directives and shebangs. If you want to explain something, rename it or restructure it.
- **Arrow functions only.** No `function` declarations or expressions anywhere. ESLint blocks both.
- **Named exports only.** `export default` is reserved for `src/app/**` and root `*.config.*` files.
- **Define before use.** Arrow consts do not hoist; a helper appears above its first caller, at module scope and inside function bodies alike.
- **British English in prose** — chat, commits, PR text, and user-facing UI copy. Code identifiers and CSS properties keep their required spelling (`color`, `center`).
- **Never hardcode personal data** in components. Everything flows from `@/lib/data`.
- **Never hardcode a themed colour.** Use `rgb(var(--accent-rgb) / …)`, a CSS variable, or a `THEMES` swatch. Of the Tailwind colour families, only `purple` and `emerald` have a usable remapped `bg-*-900` / `text-*-400` pair; `blue`, `cyan`, `red`, `amber` and friends leak literal colour into the amber and cyberpunk palettes.
- **Package manager is pnpm.** Never run `npm` or `yarn`.
- **Lint baseline is 6 problems (5 errors, 1 warning)** — all pre-existing `react-hooks/*` errors in `src/lib/hooks.ts`, `src/components/*`. A task passes lint if the count is still 6 and no new file appears in the output. It is not "clean"; do not try to fix the baseline.

## A note on testing

**This repo has no test framework and no test files.** There is no `pnpm test`. Adding vitest/jest is out of scope for this plan — it was not requested and would be a much larger change than the feature itself.

So the red-green cycle in each task is replaced by a concrete, runnable verification cycle:

1. `pnpm lint` — count must still be 6 problems
2. `pnpm build` — must exit 0 (this is the type-check *and* the prerender)
3. A **specific DOM or output assertion** — a `grep` against the built `out/` HTML, or a Playwright interaction against `pnpm dev`

Every task below states the exact command and the exact expected output. Do not mark a step done without running it and seeing that output.

**Starting the dev server:** run `pnpm dev` in the background; it serves on `http://localhost:3000`. Playwright MCP tools (`browser_navigate`, `browser_click`, `browser_snapshot`, `browser_press_key`, `browser_evaluate`) are available for the interaction checks.

---

### Task 1: Add the optional `timezone` config field

The availability panel's clock needs an IANA timezone. `PortfolioConfig` and the zod schema are separate declarations kept honest by `SchemaMatchesPortfolioConfig` at the foot of the schema — add the field to one and not the other and `pnpm build` fails with a type error. That failure is this task's "red" state, and you will deliberately observe it.

**Files:**
- Modify: `src/types/index.ts` (the `PersonalInfo` interface, ~line 27-39)
- Modify: `scripts/portfolio-schema.ts` (the `personalInfo` object, ~line 44-56)
- Modify: `src/lib/data.config.example.ts` (the `personalInfo` block, ~line 20-40)

**Interfaces:**
- Consumes: nothing
- Produces: `personalInfo.timezone?: string` — an IANA identifier such as `"Europe/London"`. Task 2 reads it. It is optional and may be `undefined` at runtime even though the example config sets it.

- [ ] **Step 1: Add the field to the type only, and watch the build fail**

In `src/types/index.ts`, add `timezone` to `PersonalInfo` directly after `location`:

```typescript
export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  status: StatusOption;
  email: string;
  location: string;
  timezone?: string;
  bio: string;
  resumeUrl: string;
  bookingUrl?: string;
  socialLinks: SocialLink[];
  knowsAbout?: string[];
}
```

- [ ] **Step 2: Run the build to verify it fails**

Run: `pnpm build`

Expected: FAIL with a TypeScript error in `scripts/portfolio-schema.ts` on the `SchemaMatchesPortfolioConfig` assertion, because the inferred schema type no longer satisfies `PortfolioConfig`.

If the build **passes**, stop. The guard is not doing its job and something else is wrong — do not continue and do not "fix" it by skipping to Step 3.

- [ ] **Step 3: Add the matching field to the zod schema**

In `scripts/portfolio-schema.ts`, add `timezone` to the `personalInfo` object, in the same position:

```typescript
const personalInfo = z.object({
  name: z.string(),
  title: z.string(),
  tagline: z.string(),
  status: statusOption,
  email: z.string(),
  location: z.string(),
  timezone: z.string().optional(),
  bio: z.string(),
  resumeUrl: z.string(),
  bookingUrl: z.string().optional(),
  socialLinks: z.array(socialLink),
  knowsAbout: z.array(z.string()).optional(),
});
```

- [ ] **Step 4: Add it to the example config**

In `src/lib/data.config.example.ts`, add `timezone` to `personalInfo` after `location`:

```typescript
    location: "City, Country",
    timezone: "Europe/London",
```

This is what a fresh clone renders, so the panel demonstrates the clock out of the box. `knowsAbout` is already present in this file — leave it alone.

- [ ] **Step 5: Run the build to verify it passes**

Run: `pnpm build`

Expected: exit 0, "Compiled successfully", and the static export written to `out/`.

- [ ] **Step 6: Run lint**

Run: `pnpm lint`

Expected: `✖ 6 problems (5 errors, 1 warning)` — unchanged from baseline.

- [ ] **Step 7: Commit**

```bash
git add src/types/index.ts scripts/portfolio-schema.ts src/lib/data.config.example.ts
git commit -m "feat(config): add optional timezone to personalInfo"
```

---

### Task 2: Availability panel with a live local clock

A live clock in a prerendered page is a hydration mismatch by construction: the server renders one time and the client another. `useSyncExternalStore` with a server snapshot of `null` solves it — the prerendered HTML contains no time at all, and the clock appears after mount. It also keeps this out of the standing `react-hooks/set-state-in-effect` baseline, which a `useEffect` + `setInterval` + `setState` would add to.

**Files:**
- Modify: `src/lib/hooks.ts` (append `formatLocalTime` and `useLocalTime`)
- Create: `src/components/AvailabilityPanel.tsx`
- Modify: `src/components/Contact.tsx` (render the panel in the left column)

**Interfaces:**
- Consumes: `personalInfo.timezone?: string` from Task 1
- Produces:
  - `useLocalTime(timeZone?: string): { time: string; offset: string } | null` — exported from `src/lib/hooks.ts`. Returns `null` during server render, when `timeZone` is `undefined`, and when `timeZone` is not a valid IANA identifier.
  - `AvailabilityPanel` — a named export from `src/components/AvailabilityPanel.tsx`, takes no props, reads `personalInfo` itself.

- [ ] **Step 1: Add the hook to `src/lib/hooks.ts`**

Check the file's existing imports from `react` at the top and extend them — `useCallback` and `useSyncExternalStore` must both be imported. Append this at the **end** of the file. `formatLocalTime` must appear above `useLocalTime` (define before use):

```typescript
const formatLocalTime = (
  timeZone: string
): { time: string; offset: string } | null => {
  try {
    const now = new Date();
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
    const offset =
      new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "shortOffset" })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value ?? "";
    return { time, offset };
  } catch {
    return null;
  }
};

export const useLocalTime = (
  timeZone?: string
): { time: string; offset: string } | null => {
  const subscribe = useCallback((onChange: () => void) => {
    const id = window.setInterval(onChange, 1000);
    return () => window.clearInterval(id);
  }, []);

  const getSnapshot = useCallback(
    () => (timeZone ? Math.floor(Date.now() / 60000) : null),
    [timeZone]
  );

  const minute = useSyncExternalStore(subscribe, getSnapshot, () => null);

  if (minute === null || !timeZone) return null;
  return formatLocalTime(timeZone);
};
```

Three things that are load-bearing and must not be "simplified":

- `getSnapshot` returns a **minute-rounded** number. `useSyncExternalStore` compares snapshots by identity to decide whether to re-render; returning `Date.now()` raw would return a different value on every call and React would either re-render every second or warn about an unstable snapshot.
- The third argument `() => null` is the **server** snapshot. It is why the prerendered HTML has no time in it.
- The `try`/`catch` in `formatLocalTime` is not defensive padding: `timezone` comes from a user-edited JSON file, and `Intl.DateTimeFormat` throws `RangeError` on an unrecognised identifier. Without it, one typo in `portfolio.json` white-screens the home page.

- [ ] **Step 2: Create `src/components/AvailabilityPanel.tsx`**

```tsx
"use client";

import { personalInfo } from "@/lib/data";
import { useLocalTime } from "@/lib/hooks";

export const AvailabilityPanel = () => {
  const localTime = useLocalTime(personalInfo.timezone);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
        <span className="text-[rgb(var(--accent-rgb))]">$</span> status --now
      </p>

      <div className="mt-3 flex items-start gap-3">
        <span className="relative mt-[7px] flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--accent-rgb))] opacity-70 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[rgb(var(--accent-rgb))]" />
        </span>

        <div className="min-w-0">
          <p className="font-medium text-gray-800 dark:text-white">
            {personalInfo.status}
          </p>
          <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
            {personalInfo.location}
            {localTime && ` · ${localTime.time} local · ${localTime.offset}`}
          </p>
        </div>
      </div>
    </div>
  );
};
```

The pulse uses Tailwind's `motion-safe:` variant rather than the `useShouldReduceMotion` hook. The spec named the hook, but this animation is pure CSS with no JS driving it, and `motion-safe:` expresses the same requirement without a client-side branch. That is a deliberate refinement, not a miss.

- [ ] **Step 3: Render it in the Contact left column**

In `src/components/Contact.tsx`, add the import beside the other component imports:

```tsx
import { AvailabilityPanel } from "./AvailabilityPanel";
```

Then place `<AvailabilityPanel />` as the **last child** of the left column's `<motion.div variants={sectionItemVariants} className="space-y-8">` — after the `<div>` that contains the "Connect with me" heading and the socials row, still inside the `space-y-8` wrapper.

- [ ] **Step 4: Build, then assert the prerendered HTML has the status and no clock**

Run:

```bash
pnpm build && grep -c "status --now" out/index.html
```

Expected: build exits 0, and `grep` prints `1`.

Now confirm the clock is genuinely absent from the prerender:

```bash
grep -oE "[0-9]{2}:[0-9]{2} local" out/index.html || echo "NO CLOCK IN PRERENDER — correct"
```

Expected: `NO CLOCK IN PRERENDER — correct`.

If a time **is** present, `useSyncExternalStore`'s server snapshot is not being used and you have shipped a hydration mismatch. Go back to Step 1.

- [ ] **Step 5: Check the clock appears in the browser**

Start the dev server in the background (`pnpm dev`), then with Playwright: navigate to `http://localhost:3000/#contact`, take a snapshot of the contact section, and confirm the panel shows a line matching `<location> · HH:MM local · GMT±N`.

Also open the browser console and confirm there is **no** hydration warning ("Text content did not match", "Hydration failed").

- [ ] **Step 6: Run lint**

Run: `pnpm lint`

Expected: `✖ 6 problems (5 errors, 1 warning)`. If `useLocalTime` has added a `react-hooks` error, fix it — do not add it to the baseline.

- [ ] **Step 7: Commit**

```bash
git add src/lib/hooks.ts src/components/AvailabilityPanel.tsx src/components/Contact.tsx
git commit -m "feat(contact): add availability panel with local time"
```

---

### Task 3: "What I can help with" chips

Chips render from `personalInfo.knowsAbout`, which is already declared on `PersonalInfo` and already read by the Person schema in `JsonLd` — this adds its first UI consumer. **The live `portfolio.json` does not currently contain this field**, so on your machine this block will render nothing. That is the correct behaviour and is what Step 3 verifies. The example config does contain it, so a fresh clone shows it.

**Files:**
- Modify: `src/components/Contact.tsx` (left column)

**Interfaces:**
- Consumes: `personalInfo.knowsAbout?: string[]`
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Add the chips block**

In `src/components/Contact.tsx`, insert this **between** the "Connect with me" block and `<AvailabilityPanel />`:

```tsx
{personalInfo.knowsAbout && personalInfo.knowsAbout.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
      What I can help with
    </h3>
    <div className="flex flex-wrap gap-2">
      {personalInfo.knowsAbout.map((topic) => (
        <span
          key={topic}
          className="px-3 py-1.5 rounded-lg font-mono text-sm border border-[rgb(var(--accent-rgb)/0.3)] bg-[rgb(var(--accent-rgb)/0.1)] text-[rgb(var(--accent-rgb))]"
        >
          {topic}
        </span>
      ))}
    </div>
  </div>
)}
```

The `length > 0` check is not redundant with the `&&` on the field: an empty array is truthy and would render a heading over nothing.

- [ ] **Step 2: Build**

Run: `pnpm build`

Expected: exit 0.

- [ ] **Step 3: Assert the block is absent with the live data**

Run: `grep -c "What I can help with" out/index.html || echo "ABSENT — correct for live data without knowsAbout"`

Expected: `ABSENT — correct for live data without knowsAbout`, **provided** `src/lib/portfolio-data.json` has no `knowsAbout`. Confirm which case you are in first:

```bash
node -e "console.log(require('./src/lib/portfolio-data.json').personalInfo.knowsAbout ?? 'absent')"
```

If it prints `absent`, expect the grep to find nothing. If it prints an array, expect the grep to print `1` and the chips to be visible.

- [ ] **Step 4: Assert the block renders when the data exists**

Temporarily add `knowsAbout` to the live JSON to prove the block works, then revert:

```bash
node -e "const fs=require('fs');const p='./src/lib/portfolio-data.json';const d=JSON.parse(fs.readFileSync(p));d.personalInfo.knowsAbout=['React Native','TypeScript','Open Banking','AWS'];fs.writeFileSync(p,JSON.stringify(d,null,2));"
pnpm build && grep -c "What I can help with" out/index.html
```

Expected: `1`.

Then restore the file — it is gitignored and regenerated by the sync script:

```bash
node scripts/sync-data.ts
node -e "console.log(require('./src/lib/portfolio-data.json').personalInfo.knowsAbout ?? 'absent — restored')"
```

Expected: `absent — restored` (assuming `PORTFOLIO_DATA_URL` is set in `.env.local`; if the sync script reports the URL is unset it keeps the file as-is, in which case remove the key with the same `node -e` technique).

- [ ] **Step 5: Run lint**

Run: `pnpm lint`

Expected: `✖ 6 problems (5 errors, 1 warning)`.

- [ ] **Step 6: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat(contact): show knowsAbout topics as chips"
```

---

### Task 4: The modal, mounted globally

The modal is created and wired to the bus, but nothing in the UI opens it yet — that is Tasks 5 and 6. This task is verified by dispatching the event by hand. Keeping it separate means the modal can be reviewed and rejected on its own accessibility merits before any trigger depends on it.

**Files:**
- Modify: `src/components/shortcutsBus.ts`
- Create: `src/components/ContactModal.tsx`
- Modify: `src/app/layout.tsx:105-119`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces:
  - `openContactModal(): void` and `onOpenContactModal(handler: () => void): () => void` — exported from `src/components/shortcutsBus.ts`. Tasks 5 and 6 both call `openContactModal`.
  - `ContactModal` — a named export from `src/components/ContactModal.tsx`, takes no props, rendered exactly once, in the layout.

- [ ] **Step 1: Extend the bus**

In `src/components/shortcutsBus.ts`, add a third event following the existing two exactly. The constant goes with the other constants at the top; the functions go at the end of the file:

```typescript
const OPEN_CONTACT_MODAL = "portfolio:open-contact-modal";
```

```typescript
export const openContactModal = () => {
  window.dispatchEvent(new CustomEvent(OPEN_CONTACT_MODAL));
};

export const onOpenContactModal = (handler: () => void): () => void => {
  window.addEventListener(OPEN_CONTACT_MODAL, handler);
  return () => window.removeEventListener(OPEN_CONTACT_MODAL, handler);
};
```

- [ ] **Step 2: Create `src/components/ContactModal.tsx`**

The form body is lifted verbatim from `Contact.tsx` — same fields, same `mailto:` construction, same `DecodeText` button. The overlay follows `ShortcutsOverlay.tsx`: same transitions, same backdrop, same `data-lenis-prevent`.

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { onOpenContactModal } from "./shortcutsBus";
import { DecodeText } from "./DecodeText";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const ContactModal = () => {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(
    () =>
      onOpenContactModal(() => {
        triggerRef.current = document.activeElement as HTMLElement | null;
        setOpen(true);
      }),
    []
  );

  useEffect(() => {
    if (!open) return;

    nameRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const nodes = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (dialogRef.current?.contains(event.target as Node)) return;
      event.preventDefault();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", onWheel);
      triggerRef.current?.focus();
    };
  }, [open, close]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const subject = encodeURIComponent("Portfolio Enquiry");
    const body = encodeURIComponent(
      `Hi ${personalInfo.name.split(" ")[0]},\n\n${formState.message}\n\n---\nFrom: ${formState.name}\nEmail: ${formState.email}`
    );

    setOpen(false);
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={close}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            className="relative w-full max-w-lg max-h-full overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-2xl"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-3">
              <h2
                id="contact-modal-title"
                className="font-mono text-sm text-gray-800 dark:text-white"
              >
                <span className="text-[rgb(var(--accent-rgb))]">$</span> compose
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded-lg p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Fill in the details below and click to open your email client
              </p>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="contact-modal-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="contact-modal-name"
                    ref={nameRef}
                    value={formState.name}
                    onChange={(event) =>
                      setFormState({ ...formState, name: event.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-modal-email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="contact-modal-email"
                    value={formState.email}
                    onChange={(event) =>
                      setFormState({ ...formState, email: event.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-modal-message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="contact-modal-message"
                    rows={5}
                    value={formState.message}
                    onChange={(event) =>
                      setFormState({ ...formState, message: event.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Hi, I'd like to discuss a project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="glitch-box w-full py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-gray-900 font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="w-5 h-5" />
                  <DecodeText className="glitch-text" text="Open Email Client" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

Two details that differ from `ShortcutsOverlay` on purpose:

- The `wheel` handler returns early when the event originates **inside** the dialog. `ShortcutsOverlay` blocks every wheel event because its content never scrolls; this dialog has a textarea and can overflow on a short viewport, so blanket prevention would trap the user.
- Focus restoration lives in the effect **cleanup**, which runs when `open` flips back to `false`. That covers all three ways out — Escape, backdrop, and submit — without repeating the call in each.

- [ ] **Step 3: Mount it in the layout**

In `src/app/layout.tsx`, add the import beside the other component imports:

```tsx
import { ContactModal } from "@/components/ContactModal";
```

and render it after `<ShortcutsOverlay />`:

```tsx
            <CommandPalette />
            <ShortcutsOverlay />
            <ContactModal />
            <KonamiEasterEgg />
```

- [ ] **Step 4: Build**

Run: `pnpm build`

Expected: exit 0.

- [ ] **Step 5: Verify the modal opens, traps focus, and closes**

With `pnpm dev` running, using Playwright:

1. `browser_navigate` to `http://localhost:3000/projects/` — deliberately **not** the home page, to prove the modal is global chrome
2. `browser_evaluate`: `() => window.dispatchEvent(new CustomEvent("portfolio:open-contact-modal"))`
3. `browser_snapshot` — expect a dialog with the `$ compose` heading and the three fields
4. Confirm focus is on the name field: `browser_evaluate`: `() => document.activeElement?.id` → expect `"contact-modal-name"`
5. `browser_press_key` `Escape` → `browser_snapshot` shows the dialog gone
6. Re-open via step 2, then click the backdrop → dialog closes

Expected: all six behave as described. A dialog that renders on `/projects/` is the proof that Task 6's ⌘K entry will work from any route.

- [ ] **Step 6: Run lint**

Run: `pnpm lint`

Expected: `✖ 6 problems (5 errors, 1 warning)`.

- [ ] **Step 7: Commit**

```bash
git add src/components/shortcutsBus.ts src/components/ContactModal.tsx src/app/layout.tsx
git commit -m "feat(contact): add globally mounted message modal"
```

---

### Task 5: Replace the inline form with a CTA card

The form now exists in two places. This task removes the original and gives the right column its new job.

**Files:**
- Modify: `src/components/Contact.tsx` — the right-column `motion.div` (the one wrapping `<form onSubmit={handleSubmit}>`, second child of the `grid lg:grid-cols-2` div), plus the file's imports and the now-unused form state

Line numbers are not given here on purpose: Tasks 2 and 3 have already shifted them. Find the element by its content.

**Interfaces:**
- Consumes: `openContactModal()` from Task 4
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Replace the right column**

Swap the entire `<motion.div variants={sectionItemVariants}>` that wraps the `<form>` — from that opening tag through its matching `</motion.div>` — for this:

```tsx
<motion.div variants={sectionItemVariants}>
  <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-gray-900">
        <MessageSquare className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
        Start a conversation
      </h3>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
      Tell me what you&apos;re building. The form fills in your email client —
      nothing is sent through this site.
    </p>

    <div className="space-y-3">
      <motion.button
        type="button"
        onClick={openContactModal}
        aria-haspopup="dialog"
        className="glitch-box w-full py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-gray-900 font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Mail className="w-5 h-5" />
        <DecodeText className="glitch-text" text="Send me a Message" />
      </motion.button>

      {personalInfo.bookingUrl && (
        <motion.a
          href={personalInfo.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-xl border border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Calendar className="w-5 h-5" />
          Book a Chat
        </motion.a>
      )}
    </div>

    <div className="mt-auto pt-8 font-mono text-xs text-gray-500 dark:text-gray-400">
      <span className="text-[rgb(var(--accent-rgb))]">$</span> awaiting input
      <span className="ml-1 inline-block h-3.5 w-2 align-middle bg-[rgb(var(--accent-rgb))] motion-safe:animate-pulse" />
    </div>
  </div>
</motion.div>
```

`h-full flex flex-col` plus `mt-auto` on the prompt line is what makes the card match the taller left column instead of floating short. The grid keeps its default stretch alignment — do not add `items-start`.

- [ ] **Step 2: Remove the dead form code**

From `src/components/Contact.tsx`, delete:

- the `formState` `useState` call and the `handleSubmit` arrow function (lines ~38-53)
- `Send` from the lucide import — it was already unused before this change
- `MessageSquare` and `Calendar` stay (both used by the new card); `Mail` stays (CTA icon); `Copy`, `Check`, `Eye`, `MapPin` stay (email and location cards)
- `DecodeText` stays (CTA button)

Keep the `revealed` state and `useClipboard` — the email card is unchanged.

Add the bus import:

```tsx
import { openContactModal } from "./shortcutsBus";
```

- [ ] **Step 3: Build**

Run: `pnpm build`

Expected: exit 0. A "declared but never read" error here means Step 2 missed an import — fix it rather than adding an eslint-disable.

- [ ] **Step 4: Assert the inline form is gone from the prerender**

Run:

```bash
grep -c 'id="name"' out/index.html || echo "INLINE FORM REMOVED — correct"
grep -c "Start a conversation" out/index.html
```

Expected: `INLINE FORM REMOVED — correct`, then `1`.

The modal's fields use `contact-modal-*` ids and only exist after it opens, so neither should appear in the static HTML.

- [ ] **Step 5: Verify the CTA opens the modal and returns focus**

With `pnpm dev` running, using Playwright:

1. Navigate to `http://localhost:3000/#contact`
2. Click "Send me a Message"
3. `browser_snapshot` — the dialog is open, focus is on `contact-modal-name`
4. Press `Escape`
5. `browser_evaluate`: `() => document.activeElement?.textContent` → expect it to contain `Send me a Message`

Expected: focus returns to the button that opened the dialog. Step 5 failing means the cleanup-based restoration in Task 4 is not firing.

- [ ] **Step 6: Run lint**

Run: `pnpm lint`

Expected: `✖ 6 problems (5 errors, 1 warning)`.

- [ ] **Step 7: Commit**

```bash
git add src/components/Contact.tsx
git commit -m "feat(contact): replace inline form with a CTA card"
```

---

### Task 6: Command palette entry

**Files:**
- Modify: `src/components/CommandPalette.tsx` (imports at ~line 30-37, Actions group at ~line 183-200)

**Interfaces:**
- Consumes: `openContactModal()` from Task 4
- Produces: nothing

- [ ] **Step 1: Extend the bus import**

The file already imports from the bus. Extend that line:

```tsx
import { onOpenCommandPalette, openShortcuts, openContactModal } from "./shortcutsBus";
```

`MessageSquare` also needs adding to the existing `lucide-react` import block at the top of the file.

- [ ] **Step 2: Add the command**

In the `cmds` array, insert this immediately **before** the existing `action-copy-email` entry, so composing ranks above copying:

```tsx
      {
        id: "action-message",
        label: "Send a message",
        group: "Actions",
        icon: <MessageSquare size={16} />,
        keywords: "contact email compose write get in touch",
        perform: () => openContactModal(),
      },
```

`perform: () => openContactModal()` rather than `perform: openContactModal` matches the shape of the neighbouring `action-shortcuts` entry.

- [ ] **Step 3: Build**

Run: `pnpm build`

Expected: exit 0.

- [ ] **Step 4: Verify from a non-home route**

With `pnpm dev` running, using Playwright:

1. Navigate to `http://localhost:3000/bookmarks/`
2. `browser_press_key` `Meta+k` (or `Control+k` on Linux/Windows)
3. Type `message`
4. `browser_snapshot` — "Send a message" appears under **Actions**
5. Press `Enter`
6. `browser_snapshot` — the palette has closed and the compose dialog is open

Expected: the dialog opens on a route where `Contact` is not mounted. That is the whole reason the modal lives in the layout.

- [ ] **Step 5: Run lint**

Run: `pnpm lint`

Expected: `✖ 6 problems (5 errors, 1 warning)`.

- [ ] **Step 6: Commit**

```bash
git add src/components/CommandPalette.tsx
git commit -m "feat(palette): add send a message action"
```

---

### Task 7: Cross-palette and reduced-motion verification

Everything works in matrix. The remap rules mean that is not evidence it works in the other two palettes, and this is exactly the failure the `--accent-rgb` convention exists to prevent.

**Files:**
- Modify: any of the above, only if a defect is found

**Interfaces:**
- Consumes: everything
- Produces: nothing

- [ ] **Step 1: Screenshot the contact section in all three palettes**

With `pnpm dev` running, for each theme id in `matrix`, `cyberpunk`, `amber`:

1. `browser_evaluate`: `() => { localStorage.setItem("theme", "<id>"); }`
2. `browser_navigate` to `http://localhost:3000/#contact`
3. `browser_take_screenshot` of the contact section

Expected: in each screenshot the status dot, the `$ status --now` prompt, the chips, and the `$ awaiting input` cursor all carry **that palette's** accent — green, cyan, gold respectively. Any element still rendering green in the amber shot is a hardcoded colour; find it and convert it to `rgb(var(--accent-rgb) / …)`.

- [ ] **Step 2: Screenshot the modal in all three palettes**

Repeat Step 1, but click "Send me a Message" before screenshotting. Check the `$ compose` prompt colour specifically.

- [ ] **Step 3: Check reduced motion**

`browser_evaluate` cannot change the OS setting; use the Playwright emulation instead, or check manually via devtools' "Emulate CSS prefers-reduced-motion: reduce".

Expected: the status dot stops pinging and the cursor stops pulsing. Both are `motion-safe:` variants, so this is a CSS-only check.

- [ ] **Step 4: Check the mobile layout**

`browser_resize` to 390×844, navigate to `/#contact`, screenshot.

Expected: the grid collapses to one column, the CTA card sits below the info blocks, and the modal fits the viewport with the fields reachable — the dialog's `max-h-full overflow-y-auto` handles the short-viewport case.

- [ ] **Step 5: Final full check**

Run:

```bash
pnpm lint; pnpm build
```

Expected: `✖ 6 problems (5 errors, 1 warning)` and a build exiting 0.

- [ ] **Step 6: Commit any fixes**

Only if Steps 1-4 found something:

```bash
git add -A
git commit -m "fix(contact): correct palette leaks in the new blocks"
```

---

## Follow-up, outside this plan

`personalInfo.knowsAbout` and `personalInfo.timezone` are read if present but are **not** in the live `portfolio.json`. To light up both new blocks on the deployed site, add them to `personalInfo` in the private `portfolio-data` repo:

```json
"timezone": "Europe/London",
"knowsAbout": ["React Native", "TypeScript", "Open Banking", "AWS"]
```

`knowsAbout` also feeds the Person schema in `JsonLd`, so this improves the structured data at the same time. No code change is needed — the sync script picks it up on the next build.

# The design system — build this before any screen

The single rule everything else follows from:

> **No colour, size, radius, spacing value or font stack ever appears inside a component.** Every one of them is a named token defined in one file. A complete rebrand is one file changed.

If a component contains `#DC5B42` or `padding: 18px`, the system has already failed — because the rebrand, the dark mode and the accessibility pass all become a hunt through every screen.

---

## Colour

### Name colours by ROLE, never by appearance

The most common failure in a mockup that later needs to change: `--blue-500`. When the brand becomes green, every name is a lie and every usage has to be re-read to work out what it meant.

```
--surface          the page behind everything
--surface-raised   cards and panels sitting on it
--surface-sunken   wells, inputs, chart tracks
--ink              primary text
--ink-soft         labels and secondary text
--ink-faint        disabled, placeholder
--accent           the brand colour — the ONE thing that changes on rebrand
--accent-hover     pressed and hover states
--accent-wash      tint behind icons and soft badges
--rule             hairlines and borders
--positive         success and confirmation
--caution          warnings
--critical         destructive and error
```

**Semantic names survive a rebrand; literal names do not.** With this set, changing `--accent` changes the product.

### Keep the palette small

**4–6 named values plus neutrals.** More than that and the mockup stops looking designed and starts looking assembled. If a seventh colour seems necessary, it is usually a job for a shade of an existing one.

### Light and dark from day one

Not a later pass. Retrofitting dark mode means revisiting every screen, and every hard-coded value you got away with becomes visible at once.

```css
:root { --surface: #FAF7F5; --ink: #1C1A19; --accent: #DC5B42; }

@media (prefers-color-scheme: dark) {
  :root { --surface: #171513; --ink: #F4F0ED; --accent: #E87059; }
}

:root[data-theme="dark"]  { /* explicit override wins over the media query */ }
:root[data-theme="light"] { }
```

Support both the system preference **and** an explicit toggle, and let the explicit one win in both directions.

**Dark is not inverted light.** Three things that always need adjusting:
- **Lift the accent's lightness.** A colour that reads well on white is usually muddy on near-black.
- **Never use pure black or pure white.** `#000` on `#FFF` is harsh; near-black and near-white are calmer and look intentional.
- **Shadows barely work in dark.** Separate surfaces with a lighter raised colour and a subtle border instead of a drop shadow.

### Contrast is a functional requirement

WCAG AA — 4.5:1 for body text, 3:1 for large text and UI boundaries. **Check both themes.** For an older or low-vision audience, treat AA as the floor and aim higher on anything read at distance.

---

## Spacing

**One scale, and everything snaps to it.** A 4px base is the standard choice:

```
--space-1: 4px    --space-4: 16px   --space-7: 40px
--space-2: 8px    --space-5: 24px   --space-8: 64px
--space-3: 12px   --space-6: 32px   --space-9: 96px
```

**No value outside the scale.** The moment `padding: 18px` appears, the rhythm is gone and nobody can tell why the page feels slightly wrong.

**Space communicates grouping.** Related things sit closer than unrelated things, and that difference should be at least two steps of the scale or the eye will not read it. Most cramped-looking interfaces are not short of space overall — they use the *same* gap between related and unrelated elements.

---

## Radius — pick relationships, not numbers

The failure this prevents: a card at 28px, a button at 6px, an input at 12px, chosen separately at different times. Nothing is wrong individually and the whole thing looks incoherent.

**Define a scale and state the relationships:**

```
--radius-sm    6px    inputs, small controls, table cells
--radius-md   12px    buttons, chips, badges
--radius-lg   20px    cards nested inside other cards
--radius-xl   28px    top-level cards, panels, modals
--radius-full 999px   pills, avatars, circular buttons
```

**The two rules that keep it coherent:**

1. **Nested corners get smaller, not bigger.** A card inside a card steps *down* the scale. A large radius inside a small one reads as a mistake even to people who cannot say why.
2. **Concentric radii should relate**: an inner radius of roughly `outer − padding` keeps the curves parallel. A 28px card with 16px padding wants an inner radius near 12px.

**Commit to a personality and hold it.** Fully round pills with 6px cards is a mixed message. Either the product is soft (large radii, pills everywhere) or it is precise (small radii, square-ish) — pick one and be consistent. If buttons are pills, chips should be pills too.

---

## Type

**Two faces, three at most:**
- **Display** — carries the personality. Used with restraint, at large sizes only.
- **Body / UI** — chosen for legibility, not character. This is most of the product.
- Optionally a **mono** for code, data, or timers where digit alignment matters.

**One scale, and every size comes from it:**

```
--text-xs   13px    --text-lg    20px    --text-3xl  44px
--text-sm   15px    --text-xl    24px    --text-4xl  56px
--text-base 17px    --text-2xl   32px    --text-hero 96px+
```

**Set the base from the audience, not from habit.** 16px is a floor, not a default. An older or low-vision audience wants 17–19px body and everything else scaling from it.

**Always set line height with size.** Tight for display (1.1–1.2), comfortable for body (1.5–1.6). Long body text at 1.2 is unreadable and it is the single most common type mistake.

**Numbers that update need `font-variant-numeric: tabular-nums`** — otherwise a running timer visibly jitters as digit widths change.

---

## Elevation

Pick **one** way to separate surfaces and use it consistently: shadow, border, or a background shift. Mixing all three is what makes a UI look assembled by different people.

Three levels is plenty — flat, raised, floating (modals, menus). If a fourth seems necessary, the layout is probably too deep.

Remember shadows barely read in dark mode; plan the border or surface-shift equivalent at the same time.

---

## Components — define once, use everywhere

Build these before the screens, from tokens only:

**Button** — primary, secondary, ghost, destructive; default, hover, active, focus, disabled, loading. **A button with no focus state is not finished.**
**Input** — label, field, helper text, error state, disabled. Errors say what to do next.
**Card** — the container everything sits in.
**Chip / pill** — selected and unselected. Selected must be distinguishable **without relying on colour alone**.
**Modal** — backdrop, panel, close, scrollable body, Escape to dismiss, focus trapped.
**Table row** — including the hover and clickable states, if rows open.
**Empty state** — an illustration or glyph, a line explaining what goes here, and the action that fills it. Design it once and reuse it.

**Minimum target size 44×44px**, and larger for an audience with reduced dexterity.

---

## Navigation

Pick the pattern from the shape of the product, not from fashion:

- **Sidebar** — 4–8 top-level destinations, desktop-first, and the user moves between them often. Most tools.
- **Top bar** — few destinations, or content-led and marketing-adjacent.
- **Bottom bar** — mobile, 3–5 destinations, thumb reach matters.

Whatever the pattern: **the current location must be unmistakable** (not a faint tint), destinations are named for what the user does there rather than how the system is built, and **full-screen modes are entered from a destination rather than being one.** A workout session, a video player, a canvas — these take over the screen but do not appear in the nav.

---

## Motion

**Default to less.** Extra animation is one of the strongest signals that an interface was generated rather than designed.

```
--motion-fast   120ms   hover, focus, small state changes
--motion-base   200ms   most transitions
--motion-slow   320ms   modals, page-level changes
```

Ease-out for things entering, ease-in for things leaving. **Respect `prefers-reduced-motion` and mean it** — not a shorter animation, no animation.

One orchestrated moment lands harder than movement scattered everywhere. And during any task where the user is concentrating, motion should stop entirely.

---

## Making the brand swappable

The client will change their mind, or the same mockup will be shown to a second client. Build for it from the start:

1. **Every visual value is a token**, no exceptions.
2. **Colour tokens are semantic**, so `--accent` means "the brand colour" regardless of what colour it is.
3. **Font families are two tokens**, `--font-display` and `--font-body`, referenced nowhere else.
4. **The radius scale is one block** — softening or sharpening the whole product is five numbers.
5. **Keep a themes block**, so an alternative brand is a set of overrides rather than an edit:

```css
:root[data-brand="alt"] {
  --accent: #2F6F5E;
  --font-display: "Some Other Face", serif;
  --radius-xl: 8px;
}
```

**Test it before you finish.** Change `--accent`, reload, and look at every screen. Anything that did not change is a hard-coded value you missed — and that is exactly the bug you are trying to prevent.

---

## The style guide page

A `/styleguide` route rendering the system from the same tokens the app uses:

- Palette swatches with token names and values, in both themes
- The type scale, each size labelled and shown in use
- The spacing and radius scales, drawn
- Every component in every state
- A light/dark toggle

Two reasons it earns its place: the client can approve or reject the **branding at token level**, which is a much cheaper conversation than arguing screen by screen — and it documents the system for whoever builds the real thing.

---

## The checklist

- [ ] No hex, px, or font stack in any component.
- [ ] Colour tokens are **semantic**, not literal.
- [ ] **Light and dark both work**, on every screen, and the toggle beats the system preference.
- [ ] Contrast meets AA in **both** themes.
- [ ] One spacing scale, and nothing off it.
- [ ] Radius scale with **stated relationships**; nested corners step down.
- [ ] Type scale with line heights; base size set from the audience.
- [ ] Tabular numerals anywhere numbers change.
- [ ] Every component has hover, focus, active and disabled.
- [ ] Empty states designed.
- [ ] Targets ≥ 44px.
- [ ] Reduced motion respected.
- [ ] **Changing `--accent` visibly rebrands every screen.**

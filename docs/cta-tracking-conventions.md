# CTA Click Tracking Conventions

## Overview

We use `data-` attributes on CTA elements instead of UTM parameters on internal links. UTM params on internal links cause Google Analytics to start a new session and overwrite the user's original acquisition source (e.g. paid Google Ads). Data attributes let GTM track clicks without touching the URL.

## Attributes

Every CTA button or link should have two data attributes:

| Attribute             | Purpose                            | Example                   |
| --------------------- | ---------------------------------- | ------------------------- |
| `data-click-location` | Where the button lives on the site | `comparison_courier_hero` |
| `data-click-text`     | What the button says or does       | `start_for_free`          |

## Naming Rules

- All lowercase
- Underscores instead of spaces
- No special characters

### `data-click-location`

Format: `{page}_{subpage}_{section}`

The location must be globally unique across the site so events from different pages don't collide in analytics.

**Examples:**

| Page                 | Section      | Value                             |
| -------------------- | ------------ | --------------------------------- |
| Comparison (Courier) | Hero         | `comparison_courier_hero`         |
| Comparison (Courier) | Intro        | `comparison_courier_intro`        |
| Comparison (Courier) | Frustrations | `comparison_courier_frustrations` |
| Comparison (Courier) | Difference   | `comparison_courier_difference`   |
| Comparison (Courier) | Banner       | `comparison_courier_banner`       |
| Comparison (Courier) | Bottom CTA   | `comparison_courier_cta`          |
| Comparison (Knock)   | Hero         | `comparison_knock_hero`           |
| Pricing              | Hero         | `pricing_hero`                    |
| Pricing              | FAQ          | `pricing_faq`                     |
| Homepage             | Hero         | `home_hero`                       |
| Homepage             | Bottom CTA   | `home_cta`                        |

### `data-click-text`

Derived from the visible button label, lowercased with underscores.

| Button Label       | Value                |
| ------------------ | -------------------- |
| Start for Free     | `start_for_free`     |
| Get Started        | `get_started`        |
| Switch to Novu     | `switch_to_novu`     |
| Talk To Sales      | `talk_to_sales`      |
| Migration Guide    | `migration_guide`    |
| Jump to Comparison | `jump_to_comparison` |
| Book a Demo        | `book_a_demo`        |

## How It Works in Code

### 1. Types

CTA interfaces in `src/types/` expose optional `clickLocation` and `clickText` fields:

```ts
// src/types/common.ts
export type TSectionAction =
  | {
      kind: "primary-button"
      label: string
      href: string
      clickLocation?: string
      clickText?: string
    }
  | {
      kind: "secondary-button"
      label: string
      href: string
      clickLocation?: string
      clickText?: string
    }
// ...
```

The same pattern applies to `IBanner.cta`, comparison section CTA types, and `IContentCtaBlock`.

### 2. Data files

Set the values in the page data file:

```tsx
// src/data/pages/comparison/courier.tsx
primaryCta: {
  label: "Start for Free",
  href: "https://dashboard.novu.co/auth/sign-up",
  clickLocation: "comparison_courier_hero",
  clickText: "start_for_free",
},
```

### 3. Components

Components pass the values through as data attributes on the `<a>` / `<NextLink>` element:

```tsx
<NextLink
  href={cta.href}
  data-click-location={cta.clickLocation}
  data-click-text={cta.clickText}
>
  {cta.label}
</NextLink>
```

The attributes are optional — if not provided, they simply won't render on the element. Existing pages won't break.

## Do NOT use UTM parameters on internal links

**Bad:**

```html
<a
  href="https://dashboard.novu.co/auth/sign-up?utm_source=internal&utm_campaign=comparison"
>
  Start for Free
</a>
```

**Good:**

```html
<a
  href="https://dashboard.novu.co/auth/sign-up"
  data-click-location="comparison_courier_hero"
  data-click-text="start_for_free"
>
  Start for Free
</a>
```

## Supported Components

The following components already support `clickLocation` / `clickText`:

| Component                 | File                                               |
| ------------------------- | -------------------------------------------------- |
| Comparison Hero           | `src/components/pages/comparison/hero.tsx`         |
| Comparison Intro          | `src/components/pages/comparison/intro.tsx`        |
| Comparison Frustrations   | `src/components/pages/comparison/frustrations.tsx` |
| Comparison Difference     | `src/components/pages/comparison/difference.tsx`   |
| Banner                    | `src/components/pages/banner.tsx`                  |
| ActionGroup (CTA section) | `src/components/ui/action-group.tsx`               |
| Content CTA               | `src/components/content/cta.tsx`                   |

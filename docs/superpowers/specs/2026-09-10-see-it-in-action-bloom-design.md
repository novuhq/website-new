# See It in Action Bloom Design

## Goal

Make the `See it in action` bloom visually match the Figma frame at desktop and mobile sizes. The bloom must continue beyond the video frame without visible clipping or a separate, mismatched halo.

## Design

- Keep the existing Figma bloom artwork as the detailed texture and color source.
- Position the artwork as a 1920×1244 canvas, preserving its aspect ratio and aligning its origin to the video frame using the Figma canvas coordinates.
- Place a continuation layer behind the artwork and outside the video frame's clipping context. This layer uses the same Figma-derived colors and broad ellipse geometry only to extend the fade where the artwork ends.
- Keep the video frame's rounded clipping and gradient border unchanged, with the bloom layers behind the frame.
- Use proportional positioning at mobile widths so the bloom remains centered and does not squash horizontally.
- Do not add independent noise or dot textures; the Figma artwork remains the sole texture source.

## Component boundary

The change stays within `src/components/pages/no-reply-is-dead/see-it-in-action.tsx` and its existing glow asset unless Figma inspection shows that an additional exported layer is required. No video, copy, or frame-border behavior changes are included.

## Validation

- Compare the rendered section with the supplied Figma node at desktop and mobile widths.
- Check that the bloom extends past the frame on all sides without hard edges.
- Run Prettier, ESLint, and the relevant type check.


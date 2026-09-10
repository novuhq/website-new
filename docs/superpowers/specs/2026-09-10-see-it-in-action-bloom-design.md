# See It in Action Bloom Quality

## Goal

Improve the image quality of the existing `See it in action` bloom. The user confirmed that the current artwork, shape, and placement are correct; only rendering quality needs to change. This supersedes the earlier hybrid bloom proposal.

## Design

- Export Figma node `45565:81855` in file `sq4Qtfr7jrTKANvKpPFzWI` at 2× (3840×2488).
- Encode as **lossless** WebP. Lossy is ruled out: at q95 and q90 the dark outer falloff visibly bands and blocks, which is the exact artifact this work exists to avoid. Grain survives lossy fine; the smooth dark gradient does not.
- Downscale the export to **2400px wide** (2400×1555, same aspect) before encoding. Resolution, not quality, is the lever that reduces size without banding — 3840 lossless costs 4.54 MiB against 1.66 MiB at 2400, and upscaled side by side the grain difference on a 2× display is marginal. 1920 saves more but softens the speckle visibly.
- Serve this asset directly with `unoptimized` on the existing Next.js Image so another lossy compression pass cannot degrade the grain or gradients.
- Preserve the current CSS geometry, aspect ratio, responsive sizing, frame, and video behavior.
- Use the single exported artwork, without additional halos, noise, or clipping containers.
- Keep the image lazily loaded. Note that `unoptimized` emits no `srcset`, so every device downloads this one asset — mobile included, where the bloom renders far smaller. That is the reason to keep the single asset modest rather than maximal.

## Component boundary

The change stays within `src/components/pages/no-reply-is-dead/see-it-in-action.tsx` and its existing glow asset. No global image configuration, video, copy, or frame-border changes are included.

## Validation

- Verify the shipped asset is lossless WebP at 2400×1555, preserving the export's aspect ratio.
- Compare desktop and mobile browser renders, including a high-density screen, and verify that the browser requests the original asset directly.
- Confirm the image geometry and video playback remain intact.
- Run Prettier, `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

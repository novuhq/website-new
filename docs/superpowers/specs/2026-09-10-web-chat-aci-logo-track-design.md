# Web Chat ACI framework logo track

Approved in conversation on September 10: replace the static outer framework
logos with one coordinated track through the center plate.

## Scope and source

Figma desktop image `45487:81047`, mobile image `45497:147061`, logo set
`45497:146963`. The original animation requirement is a roughly three-second
center hold, vertical travel on desktop, and left-to-right travel on mobile.
The supplied Figma image has no authored keyframe tracks; timing follows that
written requirement and the approved interpretation.

The current 106px center-only overlay leaves the outer logos baked into the
JPG. Replace both JPGs with clean 2× Figma exports, removing only the framework
logo nodes and their corner frames. Preserve the agent plate, text, lighting,
Novu sphere, channel tiles, lines, and the rest of the section.

## Rendering and motion

Keep the existing server-rendered `FrameworkLogoCycle` and SVG asset pipeline.
Expand its overlay to the illustration bounds. Use one shared CSS timeline with
phase offsets for five logos; no JavaScript timer or hydration dependency.

During each hold, one logo is centered at full opacity, with the previous and
next logos at the outer positions at 40% opacity. All positions advance together
after a 3000ms hold, over a 700ms movement. Desktop defaults to downward travel per the September 10 user preference;
the existing optional upward direction remains supported. Mobile always moves
left to right. Logos fade to zero outside the track; no stationary fallback is
visible beneath moving logos. Per the latest September 10 screenshot feedback,
corner frames remain visible at the outer positions, fade away as a logo enters
the center, and fade back in as it leaves. The centered hold has no corner frame.

The initial composition is Vercel in the center, LangChain outgoing, Claude
incoming. The subsequent centers are Claude, AWS, Custom code, and LangChain.
All five return to the initial composition after 18.5 seconds.

Desktop positions relative to the 1280×480 image: center `(97,187)`, upper
`(97,12)`, lower `(97,363)`, each 106×106. Mobile positions relative to the
320×658 image: center `(125,55)`, left `(7,55)`, right `(242,55)`, each 70⅔ square.
Scale positions proportionally with the image. Following the September 10 responsive audit,
use the vertical artwork and downward motion at 1024px and above. Below 1024px,
use the capped portrait artwork and horizontal motion together.

Reduced motion shows only one static centered Vercel mark without a corner frame. The decorative
animation is hidden from assistive technology; the illustration retains its
existing descriptive alt text. This section remains outside personalization.

## Verification

Freeze the browser's actual CSS timeline at each hold and during movement.
Verify the same logo travels through outer and center positions, all five logos
reach the center in order, outer opacity stays at 40% while held, corner frames
disappear only at the center and fade during the handoff, and the loop
wraps without a duplicate centered logo. Check desktop/mobile, upward/downward
travel, reduced motion, and JavaScript-disabled rendering. Inspect both clean
exports, section screenshots, and full-page screenshots in Chromium and WebKit.
Run targeted Playwright tests, lint, typecheck, and build; document any external
configuration blocker. Preserve unrelated working-tree and staged changes.

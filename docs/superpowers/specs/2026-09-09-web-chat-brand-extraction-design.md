# Web Chat brand extraction — design

Date: 2026-09-09
Status: approved and implemented on 2026-09-09. See the
[implementation log](../logs/2026-09-09-web-chat-brand-extraction.md) for validation
and real-site results.
Scope: extracting the accent returned by `/api/agent-preview`.
First release runs in the existing Node.js backend without an external service.

## Goal and starting behavior

Infer a useful website accent when HTML theme metadata is absent, invalid, or
neutral. Preserve the extracted identity and existing hero conversation when
no sufficiently supported accent is available.

Before this change, `src/lib/site-brand.ts` read only `theme-color` and
`msapplication-TileColor`, accepted only three- or six-digit hex, and rejected
low-saturation colors. It chose a hex value before checking usability, so a
white theme-color prevented a colorful TileColor from being considered.
Linked manifests, stylesheets, and logo palettes were not inspected.

The endpoint already runs in Node.js. Existing Playwright coverage mocks its
responses; it verifies the consumer, not real color extraction. Pure color
helpers have Node tests, but the extractor has no dedicated fixture tests.

## Evidence from public sites

Read-only HTML, manifest, and limited stylesheet inspection on 2026-09-09:

| Site      | Metadata and manifest                                                       | Other signals observed                                                                    |
| --------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Recent    | Light/dark meta colors are white/near-black; linked manifest theme is white | CSS includes `--accent: #ec3c00`, `--brand-red: #f15406`, and equivalent Lab declarations |
| ToDesktop | No theme tags or linked manifest found                                      | Inline `.button-primary` declares `#0036ff`, followed by a Display P3 color               |
| Novu      | No theme tags found; linked manifest returned 404                           | CSS includes primary tokens expressed as HSL channels                                     |
| Linear    | Near-black meta color; black manifest theme                                 | No primary/accent variable found in the first three inspected stylesheets                 |

These observations establish available signals, not extraction accuracy or
population-wide coverage. Recent's live colors differ from its older Figma
orange. Use current site evidence rather than hardcoded domain mappings.
Raw inspection files are local `/tmp/brand-probe-*` scratch files.

## Options

| Approach                                           | Benefit                                                                | Limitation                                                                                   | Recommendation                            |
| -------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Metadata plus manifest                             | Smallest change; explicit declarations; little extra work              | Neutral or missing declarations still leave all four inspected sites without a useful accent | Include as part of the first release      |
| Static HTML, manifest, and targeted CSS extraction | Finds useful signals on the reference sites within the current backend | Cannot reproduce all browser cascade, media, or JavaScript behavior                          | Recommended first release                 |
| Rendered-page extraction                           | Can inspect resolved CTA colors and active custom properties           | Requires a production browser runtime or service; adds latency and operational work          | Revisit after measuring static extraction |

Logo analysis can supplement either richer approach. It needs image decoding
and palette ranking; white backgrounds, monochrome marks, and multicolor logos
make a naive dominant-pixel choice unreliable. Keep it out of the first release
so metadata/CSS coverage can be measured independently. Brand-data APIs are a
separate service option if external dependencies become acceptable.

## Proposed first release

### Collect candidates

1. Parse the fetched HTML structurally and retain the final response URL.
2. Collect all theme-color and TileColor values independently. Treat theme
   media qualifiers as evidence about variants, not an instruction to always
   choose the first tag.
3. Follow the first linked manifest and read its string `theme_color` value.
   Resolve its href against the document base, including the final redirect URL
   and a valid first base element. Do not substitute `background_color`.
4. Inspect inline styles and up to three linked stylesheets. Resolve stylesheet
   URLs against the same base. Do not recursively crawl CSS imports in this
   release.
5. Collect root/theme brand variables and background declarations associated
   with primary buttons or CTA links present in the HTML. Exclude foreground,
   border, status, destructive-action, and unrelated component tokens.

Use a CSS parser, with deliberately limited selector matching and variable
resolution. Unsupported selectors, conditional branches, complex color mixes,
or cyclic variables lower confidence or are skipped. Do not claim a complete
computed-style implementation. A declaration in an unused utility class alone
is insufficient evidence.

### Normalize and choose

Use a maintained color parser such as Culori for named colors, hex, RGB, HSL,
Lab, OKLCH, and Display P3. Resolve custom-property references before parsing;
bare HSL channels require the consuming `hsl(...)` expression. Normalize to
opaque sRGB hex. Skip unresolved values and colors whose transparency cannot
be interpreted reliably from the collected evidence.

Rank strong, matching CTA evidence and corroborated brand-variable usage above
metadata. Among usable explicit metadata candidates, prefer meta theme-color,
then manifest theme_color, then legacy TileColor. Root variables with no
demonstrated use remain weaker evidence. Neutral or invalid candidates must
never prevent later candidates from being considered.

Group equivalent colors so fallback hex and modern declarations do not count
as independent corroboration. Conflicting candidates of comparable strength
should return no accent rather than choose by stylesheet order or raw frequency.
Return `accent: null` if all candidates are weak or neutral.

Keep extraction and display adjustment separate internally. Initially retain
the existing hero theme derivation and accent adjustment, so the extraction
change does not silently alter the Figma foreground-color policy. The current
lightness clamp is not proof of accessible text contrast; test rendered themes
and handle a discovered contrast regression explicitly.

### Integration and bounded fetching

Keep `getBrandProfile()` as the orchestration entry point. Separate resource
fetching, candidate collection, and pure normalization/ranking into focused
server helpers. Preserve the existing response fields; add optional
`accentSource` (`css`, `meta`, `manifest`, or null) for debugging. Keep detailed
candidate reasons internal and available to tests.

All resource requests share an eight-second deadline, including reading bodies.
Use at most three concurrent requests. Response limits: HTML 2 MiB,
manifest 64 KiB, each stylesheet 256 KiB, and the existing 200 KiB logo limit.
Read streams with limits rather than buffering arbitrary bodies first. A failed
manifest or stylesheet must not discard successful HTML identity extraction.

Implementation evaluation increased the initial 512 KiB HTML budget: actual
ToDesktop, Novu, and Linear responses were approximately 540 KiB, 620 KiB, and
1.27 MiB. Strictly enforcing the old prefix limit rejected valid pages. The
2 MiB limit accepts these responses while retaining a finite stream limit.

The existing fetch helper validates only the initial hostname and automatically
follows redirects. Before adding linked-resource fetching, validate every
destination and redirect, allow only public HTTP(S) targets, reject credentials,
and use DNS-aware connection validation rather than relying on hostname text.
Resolve relative URLs using the final fetched resource URL where appropriate.

Use bounded, best-effort process-local caching: 100 entries, a 20 MiB total size
cap, 24-hour positive TTL, and 15-minute TTL for successful profiles without an
accent. Do not cache transient fetch failures. Deduplicate concurrent requests.
Key by normalized input URL, including path/query and excluding fragments, so
different page themes are not incorrectly merged by domain. This cache is per
server instance and is not persistent infrastructure.

### Dependencies

The project already has `html-react-parser`; first assess its `htmlToDOM`
export for server HTML parsing. Add direct production dependencies for any
parser actually imported, rather than relying on transitive packages.
Culori and a CSS parser are candidates for direct dependencies. Sharp exists
transitively, while Playwright is a development dependency; neither establishes
production support for logo analysis or browser rendering.

## Acceptance and verification

- Fixture tests cover manifest-only sites, relative manifest links, redirects,
  a white meta value followed by a useful manifest/TileColor, malformed JSON,
  missing resources, and non-hex CSS colors.
- CSS fixtures cover Recent-style accent variables, ToDesktop-style CTA
  backgrounds, unused primary utilities, neutral values, variable cycles,
  conflicts, foreground exclusions, and unsupported expressions.
- Fetch tests verify body limits, shared deadlines, redirect and destination
  validation, partial success, cache expiry, and request deduplication.
- API integration tests exercise actual extraction with stubbed upstream
  resources. Existing browser tests retain hero-only personalization, identity
  retention without color, and conversation behavior on desktop and mobile.
- Run a small documented real-site evaluation after implementation. Record
  chosen color, source, latency, and manual correctness, including honest null
  results. Do not use live websites as deterministic CI assertions.
- Run relevant Node tests, lint, typecheck, and build. The existing build blocker
  is missing Notion careers read configuration; report its current status at
  validation time rather than assuming it remains unchanged.

## Sources

- [MDN: manifest theme_color](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/theme_color)
  describes an independent manifest declaration, CSS color syntax, and the
  possibility of a page-level meta override. It remains a browser UI theme
  signal rather than a guarantee of the site's CTA accent.
- [W3C Web Application Manifest](https://www.w3.org/TR/appmanifest/)
- [Culori API](https://culorijs.org/api/)
- [MDN: getComputedStyle](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)
- [Sharp input statistics](https://sharp.pixelplumbing.com/api-input/#stats)

## Review decision

Approved first-release scope: independent metadata candidates,
linked manifest support, targeted static CSS extraction, bounded fetching,
diagnostic source, and best-effort caching. Logo palettes were a separate
follow-up, now implemented below. Production browser rendering remains a later
option.

## Follow-up: broader CSS and logo fallback

On 2026-09-09 the user requested continuing through CSS variables, interface
colors, and logo/favicon evidence when manifest theme_color is absent. Extend
the existing backend in this order:

1. Keep independent metadata and manifest candidates, plus the existing static
   CSS analysis. Add colored links, explicitly active navigation and highlights
   as weaker interface evidence. Match real DOM elements and supported CSS;
   do not treat variable names or stylesheet frequency as sufficient evidence.
2. If the initial selection has no confident accent, analyze the logo/favicon
   already downloaded for identity. Decode only supported image formats within
   fixed pixel and byte limits; exclude transparent and near-neutral pixels,
   and cluster the remaining colors. A clearly dominant chromatic palette may
   supply a low-priority logo candidate. A logo color matching an otherwise weak
   brand CSS variable can corroborate that variable. Competing strong CSS colors
   must not be overwritten by unrelated image colors.
3. Preserve the default when the logo is monochrome, unsupported, malformed,
   mostly neutral with insignificant colored noise, or ambiguously multicolor.

Return `accentSource: "logo"` for selections relying on palette evidence.
No additional network request is needed for the initially downloaded icon, and
successful CSS extraction avoids palette decoding. Existing caching applies.
Sharp becomes a direct production dependency; image decoding must not execute
SVG scripts, load external SVG resources, or run arbitrary webpage code.

This static pass does not claim actual browser visibility or getComputedStyle
results. Rendering JavaScript and analyzing screenshots remain a distinct stage
requiring a production browser runtime. The user's logo/favicon/screenshot
alternatives are addressed with logo/favicon analysis in the current backend.

Verify colored-link/active/highlight fallback, background-versus-text priority,
CSS-hidden exclusion, named-variable/logo corroboration, dominant palettes,
neutral and multicolor fallbacks, malformed and oversized images, and full
manifest-without-theme_color to CSS/logo integration. Retest the real reference
domains and desktop/mobile hero after integrating.

Implemented bounds: decode at most 200 KiB and 1,048,576 input pixels, sample
at most 64 × 64 pixels, and set Sharp's processing timeout to one second. The
timeout excludes waiting for a native worker. Accept PNG, JPEG, WebP, GIF, AVIF,
static self-contained SVG, and PNG/32-bit BMP frames within ICO containers.
Skip other ICO variants and SVGs with entities or embedded/external resources.
SVG stylesheets support only reconstructed literal `fill`, `stroke`, and
`color` rules with simple selectors. Conditional media rules are omitted;
imports, unsupported declarations, namespaced style tags and style attributes
remain unsupported. Reuse the first downloaded identity icon; do not crawl page images
or analyze screenshots. Add `logo` to the diagnostic source values.

Ordinary declared link colors stay weak. Used brand-token links, CTA text, and
selected navigation/highlights carry greater weight. Supported visibility
declarations and hidden ancestors are excluded. A colored badge nested in a
selected product tab does not inherit the tab's active-navigation confidence.

The focused Recent retest exposed two similar orange tokens receiving equal
logo confidence. Corroboration now includes a bounded RGB-distance bonus, so
the closer declared brand color wins when the difference is meaningful.
Equally close shades remain ambiguous; no domain-specific colors are stored.

The Neon test exposed a green favicon whose paint is declared in a `<style>`
element. Parse those styles with the existing PostCSS dependency and emit only
validated selectors and normalized color values; never pass raw stylesheet
text to the rasterizer. Preserve declaration order, specificity and important
flags within this subset. Limit processing to 16 style elements, 32 KiB per
stylesheet and 128 unconditional rules. Use the base theme without guessing
the browser's color-scheme media state.

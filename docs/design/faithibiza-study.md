# Design study — faithibiza.com → 마음약방 v2

Analysed 2026-09-19 in a real browser (1457×812). Purpose: learn the layout system and motion grammar, then translate it to 마음약방 without copying assets, copy, or fonts. **Role in v2: visual style only.** Content order and Korean conventions come from [skin1004-study.md](skin1004-study.md).

## 1. What the site is (facts)

- WordPress 6.9 with custom blocks (`custom-block block-*`), not Webflow. Motion stack: GSAP + ScrollTrigger (12 triggers), Lenis smooth scroll, jQuery, Swiper. 12 `<video>` and 41 `<img>`. Page height ≈ 20,000px.
- Fonts: **Dream Orphans** (tall uppercase display serif, letter-spacing ≈ 1%), **Eastern Harrogate** (script, used as an "overline" phrase), **Afacad Flux** (body sans, grey `#4c5b6b`). Both display fonts are commercial.
- Palette: body sand `#eeebe4`; navy `#2f4156` (hero arch, cards); slate `#4c5b6b` (body text, tiles); teal `#3c859b` (long "trust" band); mint accent `#a0efe9` for the script line on dark. White at 70% opacity for secondary text on dark.
- Radius vocabulary: pills `100px` for nav/CTA buttons; `110px` on a few large shapes; everything else square. Ghost buttons: 1px border, transparent fill, 100px radius.
- Container ≈ 1010px inside 1457 viewport (~70%), generous side gutters.

## 2. Layout & motion grammar (what to learn)

| # | Block (class) | Height | Device |
|---|---|---|---|
| 1 | hero (`pin-spacer`) | 2889px pinned | Navy **arch** (border-radius top ≈ 50% width) sits on sand; on scroll it scales to full-bleed, a script line draws in under the uppercase H1, then a "scroll to discover" ring. One promise + one scroll cue, nothing else. |
| 2 | highlight | 1644 | Left: uppercase H2 + script sub-line + one paragraph + underlined text link. Right: rotated "polaroid" photo. Text reveals with opacity+y. |
| 3 | features | 2752 | Masonry-like **staggered grid** of video tiles (mixed sizes, offset vertically) with a one-word uppercase label under each. Tiles fade from grey placeholder to colour as they enter the viewport. |
| 4 | text-content | 823 | Centered script + uppercase headline + paragraph + ghost pill CTA. Breathing space. |
| 5 | scrolljacking | 6073 | Teal band. Left: **sticky stack of polaroids** (6 items, `position: sticky; top: 240px`) piling up as you scroll; right: one value per screen (script word + uppercase headline + paragraph). Ends with a huge horizontal **marquee**. |
| 6 | feature-cards | 1465 | Two tall cards (teal / navy), script+uppercase title, row of overlapping circular logos, one line, underlined link. |
| 7 | image-enhanced-content | 890 | Left 3-line uppercase headline, right video. Logo strip. |
| 8 | text-image (contact) | 2072 | Split screen: left full-height photo, right long form with uppercase field labels and underline-only inputs, ghost "Submit". |
| — | footer | | Navy. Big phone/email in display font, social icons, two link columns. Script word bleeds over the footer edge. |

Cross-cutting rules:
- **Two-voice typography**: every heading = script phrase (small, coloured) + uppercase display line (large, neutral). Script carries emotion, caps carry information. Never both in the same colour.
- **One accent colour only**, and only on dark backgrounds.
- **Alternating canvases**: sand → sand → sand → teal (long) → sand → navy footer. Dark blocks are rare, so they read as "moments".
- **Reveal choreography**: ~0 opacity + 24–40px down, fades up at 20–30% in view; sticky/pinned sections make scroll feel intentional; smooth scroll makes it feel expensive.
- **Fixed pill nav**: MENU left, logo centre, BOOK right.
- **Whitespace as luxury**: 800–1600px sections with one idea each. Text blocks max ~520px wide.

## 3. What NOT to take

- Fonts (commercial), photos, videos, copy, logo marks, the WhatsApp bubble. The "concierge" tone would also break the claim guide ("stress-free", etc.).
- 20,000px page and 12 videos: hurts conversion and bandwidth. Keep v2 under ~8,000px and ≤ 2 short loops.
- Scroll-jacking that hides the CTA. Our CTA must be reachable at any scroll depth.

## 4. What v2 took from here

- Ink arch hero on sand, expanding to full-bleed over the first ~0.9 viewport of scroll (`#arch`, rAF-throttled transform + border-radius; disabled under `prefers-reduced-motion`).
- Two-voice headings, with the script voice replaced by a Korean line (see skin1004 study).
- Sticky stack for the ritual section (`.stack-left { position: sticky }`), one dark band only.
- Pill buttons, hairline dividers, uppercase micro-labels with wide tracking.
- Reveal system limited to opacity + 16px; no marquee, no polaroid rotation, no floating shapes (reviewer asked to cut decoration 30–50%).

Fonts used instead: Cormorant Garamond (free) for caps, Pretendard for Korean/body.

## 5. Success metric

Not "looks premium". Quiz-start rate and pre-order-interest rate vs v1 on the same traffic.

---
name: Kedai Sinau
colors:
  surface-bright: '#FAF3E0'
  surface: '#FFFFFF'
  surface-variant: '#E0D9CE'
  on-surface: '#1A1A1A'
  on-surface-variant: '#1E3A5F'
  primary: '#C0392B'
  secondary: '#1E3A5F'
  background: '#FAF3E0'
  on-background: '#1A1A1A'
  outline: '#1E3A5F'
  outline-variant: '#E0D9CE'
  theme-dark-bg: '#261816'
  theme-dark-text: '#FAF3E0'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-h1:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-h2:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-h3:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is rooted in the **"New Editorial"** movement, blending the warmth of physical print media with the clarity of modern digital interfaces. The brand personality is intellectual, inviting, and highly curated—evoking the feeling of a quiet afternoon in a premium independent bookshop.

It prioritizes a high-signal, low-noise environment where the literary content takes center stage. This is achieved through a **Warm Minimalist** approach: using expansive "cream-space" and a sophisticated typographic scale to establish hierarchy rather than heavy decorative elements. The emotional response should be one of calm focus, scholarly trust, and avant-garde elegance.

**Language & Copywriting:** While the visual aesthetic is highly sophisticated, the copywriting must remain exceptionally simple, functional, and direct. Avoid pompous, overly verbose, or pretentious language (e.g., avoid "traversing epochs" in favor of "Browse our collection"). Functionality, usability, and clarity must never be sacrificed for aesthetic indulgence.

## Colors

The palette for this design system is inspired by parchment, ink, traditional bookbinding materials, and museum galleries.

- **Warm Cream (#FAF3E0):** The primary background that serves as the canvas. It reduces eye strain and distinguishes the experience from generic "white" web applications, giving a tactile, paper-like feel.
- **Ink Black (#1A1A1A):** A high-contrast near-black that ensures maximum legibility while appearing softer than pure hex black.
- **Curator Red (#C0392B):** A muted, scholarly red used exclusively for primary actions, badges, and high-priority highlights.
- **Gallery Navy (#1E3A5F):** A deep, sophisticated blue used for high-impact structural elements (like the Bestseller section background) and refined borders. It provides a grounding "frame" for the content.
- **Espresso Dark (#261816):** A very deep, warm brown/black used for thematic inversions, such as the *Literary Journal* section, creating a moody, contemplative reading environment.
- **Pure Surface (#FFFFFF):** White is used sparingly for interactive cards and the Testimonials section to make elements "pop" against the cream background.
- **Parchment Border (#E0D9CE):** A subtle, darker variant of the background used for delicate structural containment and dividers.

## Typography

This design system utilizes a classic serif-and-sans-serif pairing to establish an editorial rhythm.

**Newsreader (Serif)**
The primary voice for all headlines. Its traditional, authoritative, and literary character reinforces the bookstore's identity. 
- *Display & Headlines:* Used with tighter letter spacing (`-0.02em`) for large titles to mimic high-end magazine mastheads.
- *Italics:* Used extensively for author names, section subheadings, and elegant accents to break the grid's rigidity.

**Inter (Sans-Serif)**
The utilitarian workhorse for body copy, navigation, metadata, and labels. 
- Provides a clean, modern counterpoint to the serif headings, ensuring that long-form descriptions remain legible.
- *Uppercase Tracking:* Used with generous tracking (`0.05em` to `0.2em`) for small labels, overarching section tags, and navigation to create a "gallery label" aesthetic.

## Layout & Composition

The design system employs a **Fixed Grid** model within a 1200px max-width container to preserve the line length of text and prevent the "stretched" look of fluid layouts. The rhythm is highly varied, creating a journey rather than a list:

1. **The Gallery Grid (Liberated Elements):** Used for product listings and collections. Rather than confining entire book items within rigid white e-commerce boxes, the white backgrounds and borders are strictly reserved for framing the book cover images alone (acting as physical picture frames). The typography (Title, Author, Price) is "liberated", floating directly on the Warm Cream background to create a museum exhibition feel. The grid aligns perfectly horizontally to ensure easy scanning.
2. **The Museum Plaque:** Used for the *Bestseller* section. A split layout featuring a giant, low-opacity background typographic watermark, a floating book cover with an overlapping rotated badge, and a highly structured, data-rich "plaque" of information on the right.
3. **The Editorial Ledger Sidebar:** Standard browser checkboxes and radio buttons are strictly prohibited as they destroy the editorial immersion. Filters, categories, and options must be built as an "Editorial Ledger" using cleanly tracked-out text. Active states are indicated by elegant typography shifts, such as color changes to Curator Red and subtle `border-bottom` highlights.

## Elevation & Depth

To maintain its "literary" and grounded aesthetic, the design system avoids heavy, generic drop shadows. Instead, it uses **Tonal Layers**, **Low-Contrast Outlines**, and **Dramatic Contrast**.

- **Level 0 (Background):** The primary Warm Cream surface.
- **Level 1 (Cards):** White surfaces with a 1px border (`#E0D9CE`). These appear "resting" on the background.
- **The Lift:** When an element is hovered (like the ledger rows or book cards), a very subtle, diffused ambient shadow may be applied to suggest a slight lift, or an inner border expands to reveal content.
- **The Void:** Deep contrast sections (Gallery Navy and Espresso Dark) use no borders, relying entirely on color inversion and high-contrast typography to create depth.

## Components & Elements

### Book Covers & Imagery
- **Aspect Ratio:** Strictly 2:3 for all book covers.
- **Treatment:** Book covers must retain a sharp `0px` radius to mimic the physical nature of a book's spine and corners. They always include a faint 1px inner stroke (`#E0D9CE`) to ensure light-colored covers do not bleed into the background.
- **Photography:** Article images use a grayscale filter that reverts to full color on hover, adding an interactive, documentary feel.

### Badges & Labels
- **Book Badges:** Positioned at the top-left of covers. Sharp corners, translucent white backgrounds with a delicate border. *Bestseller* uses Curator Red, *New* uses Navy, *Sale* uses the Parchment Border color.
- **Section Tags:** Small, uppercase, widely tracked text used above main headings to provide context (e.g., "FRESH OFF THE PRESS", "READERS SAY").

### Navigation & Footer
- **Navbar:** A frosted-glass Warm Cream background (`#FAF3E0/90`) that blurs the content beneath it. Links are precise, tracked-out sans-serif uppercase.
- **Footer:** A solid block utilizing the Parchment Border color as a base (`#E0D9CE`), organizing links into clean, architectural columns.

### Micro-Interactions
- **Hover States:** Buttons invert their colors (e.g., Transparent to Solid Ink Black). Links reveal delicate underlines. The Ledger accordion expands fluidly.
- **Icons:** Material Symbols (Outlined, Light weight) are used sparingly for directional cues and UI controls, never overpowering the typography.
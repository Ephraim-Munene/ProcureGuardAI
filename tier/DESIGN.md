---
name: Forensic Precision
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c9'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9193'
  outline-variant: '#444749'
  surface-tint: '#c5c6c8'
  primary: '#ffffff'
  on-primary: '#2e3132'
  primary-container: '#e1e2e4'
  on-primary-container: '#626566'
  inverse-primary: '#5c5f60'
  secondary: '#c4c6d1'
  on-secondary: '#2d3039'
  secondary-container: '#444650'
  on-secondary-container: '#b3b5c0'
  tertiary: '#ffffff'
  on-tertiary: '#2b303d'
  tertiary-container: '#dee2f2'
  on-tertiary-container: '#5f6472'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e2e4'
  primary-fixed-dim: '#c5c6c8'
  on-primary-fixed: '#191c1e'
  on-primary-fixed-variant: '#444749'
  secondary-fixed: '#e0e2ed'
  secondary-fixed-dim: '#c4c6d1'
  on-secondary-fixed: '#181b24'
  on-secondary-fixed-variant: '#444650'
  tertiary-fixed: '#dee2f2'
  tertiary-fixed-dim: '#c2c6d6'
  on-tertiary-fixed: '#161b27'
  on-tertiary-fixed-variant: '#424754'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-xs:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: -0.01em
  data-label:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin: 24px
  table-row-height: 32px
  sidebar-width: 240px
  inspector-width: 400px
---

## Brand & Style
This design system is built for high-stakes oversight and forensic auditing. The brand personality is authoritative, impartial, and meticulously organized. It draws heavily from **Linear-grade GovTech** and **Modern Minimalism**, prioritizing information density over decorative elements.

The aesthetic avoids visual noise like shadows or blurs, opting instead for a "flat-layered" architecture. High-trust is established through a rigorous adherence to a 1px grid, crisp borders, and monospaced data visualization. The interface feels like a professional ledger or a high-end technical document—functional, cold, and undeniably accurate.

## Colors
The palette is rooted in a "Warm Dark Charcoal" environment to reduce eye strain during long-form audit sessions. 

- **Surface Layering**: The background (#0C0E12) serves as the canvas, while the surface (#14171F) defines interactive or elevated containers. 
- **Borders**: All structural separation is handled by 1px "Graphite" lines (#222733). 
- **Semantic Accents**: Colors are used exclusively for status and data significance. Critical, Compliant, and Warning hues are matte and desaturated to maintain a serious, professional tone without appearing "neon" or "gamified."

## Typography
The system employs a dual-font strategy to separate UI navigation from forensic data.

- **Geist/Inter**: Used for system navigation, headings, and instructional text. It is clean and systematic.
- **JetBrains Mono**: Used for all "Audit Objects"—including KES currency values, Transaction IDs, and risk percentages. This provides a clear visual signal that the user is looking at immutable data.
- **Scale**: Small font sizes (12px-14px) are the standard to accommodate high-density information displays.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model optimized for wide-screen desktop monitors.

- **Split-Screen Inspector**: A key layout pattern where clicking a row in a high-density table opens a 400px wide right-aligned "Inspector" panel for deep-dive forensics.
- **Density**: A 4px baseline grid is used. Row heights in tables are constrained to 32px to maximize the number of visible records.
- **Structure**: Uses a 12-column grid within the main content area, with fixed-width sidebars for global navigation.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **1px Outlines**, never shadows.

1.  **Level 0 (Background)**: #0C0E12.
2.  **Level 1 (Surface)**: #14171F with a #222733 border. Used for cards and table headers.
3.  **Level 2 (Active/Hover)**: A subtle shift to a slightly lighter slate (#1C1F26) to indicate interactivity.

This "flat" approach reinforces the utilitarian, government-grade nature of the application.

## Shapes
Shapes are strictly functional. The default roundedness is "Soft" (4px) for primary UI components like buttons and input fields to provide just enough distinction from the sharp grid lines. 

Inner elements, such as table cells or progress bars, use 0px (Sharp) corners to maintain the architectural, linear aesthetic.

## Components
- **High-Density Tables**: The core component. Features sticky headers, monospaced numeric columns, and row-level status indicators using 8px solid circles in semantic colors.
- **Metric Chips**: Compact, rectangular boxes with a `data-label` top and `data-mono` value. No background fill, only a 1px border.
- **Audit Buttons**: Primary actions use #F3F4F6 text on a #222733 background. Secondary actions are ghost buttons (text only with border on hover).
- **Split-Screen Inspector**: Uses a vertical 1px divider to separate the list view from the detail view. The detail view utilizes `body-sm` for narrative descriptions and `data-mono` for forensic evidence.
- **Inputs**: Dark field fills (#0C0E12) with 1px graphite borders. Focus state is a simple 1px white border.
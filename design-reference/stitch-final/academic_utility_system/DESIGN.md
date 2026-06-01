---
name: Academic Utility System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#444653'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#2d3449'
  on-tertiary: '#ffffff'
  tertiary-container: '#434b60'
  on-tertiary-container: '#b4bbd5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-qr:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 40px
  max-width: 1280px
---

## Brand & Style

This design system is engineered for high-utility academic environments. It prioritizes efficiency, speed of recognition, and professional reliability over decorative elements. The target audience includes university administrators, faculty, and students who require a frictionless tool for tracking attendance and participation.

The aesthetic follows a **Corporate / Modern** approach with a lean toward **Minimalism**. The UI is structured around clear information hierarchies, intentional whitespace to reduce cognitive load during high-traffic attendance periods, and a functional "workspace" feel that integrates seamlessly into an institutional setting. The emotional response should be one of confidence, institutional authority, and functional clarity.

## Colors

The palette is anchored by a deep "Institutional Blue" (#1E40AF) to convey trust and stability. The secondary color is a neutral Slate, used for utility icons, secondary actions, and metadata to ensure it doesn't compete with primary tasks.

- **Primary:** Core actions, active navigation states, and primary buttons.
- **Secondary:** Supporting text, secondary buttons, and decorative borders.
- **Surface:** The background uses a very light cool gray (#F8FAFC) to reduce eye strain compared to pure white.
- **Semantic:** Specific shades are reserved for attendance states (Present = Green, Late = Amber, Absent = Red). These must maintain high contrast against surface colors for accessibility.

## Typography

The design system utilizes **Inter** for all roles to leverage its exceptional legibility and systematic feel. 

- **Headlines:** Use tighter letter spacing and bold weights to create a strong visual anchor for page titles and section headers.
- **Body:** Standardized at 14px and 16px for optimal readability of student lists and data tables.
- **Labels:** Used for status badges and table headers, employing a slightly heavier weight and uppercase styling to differentiate from interactive content.
- **Numerical Data:** Specific attention is paid to tabular figures to ensure alignment in attendance lists and time-stamps.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop to maintain information density without feeling sprawling. A 12-column grid is used for dashboards, while a centered single-column layout (max-width 640px) is utilized for the QR scanning interface to focus the user's attention.

- **Desktop:** 12 columns, 20px gutters, 40px side margins.
- **Mobile:** 4 columns, 16px gutters, 16px side margins.
- **Vertical Rhythm:** A 4px baseline grid ensures consistent spacing between form fields, table rows, and list items. 
- **Containers:** All primary data containers (tables, QR displays) should utilize `lg` (24px) padding to ensure content does not feel cramped.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** to define hierarchy, avoiding heavy shadows to maintain a modern, flat workspace aesthetic.

- **Level 0 (Surface):** The main background (#F8FAFC).
- **Level 1 (Cards/Tables):** Pure white (#FFFFFF) background with a 1px solid border (#E2E8F0). No shadow.
- **Level 2 (Modals/Overlays):** Pure white with a very soft, high-diffusion ambient shadow (Offset 0, 10, Blur 15, Opacity 4%) to indicate focus.
- **Active State:** Elements being interacted with (like an active input) use a 2px primary color outline.

## Shapes

The shape language is **Soft** and professional. This subtle rounding prevents the UI from feeling aggressive while maintaining a crisp, disciplined look suitable for an academic tool.

- **Components:** Buttons, input fields, and cards use a 0.25rem (4px) radius.
- **Badges:** Status indicators for attendance use the same 4px radius or "Soft" setting to maintain consistency with the grid.
- **QR Containers:** The frame around a QR code should be perfectly square on the inside, with a 0.5rem (8px) radius on the outer container.

## Components

### Buttons
- **Primary:** Solid #1E40AF background, white text. No gradients.
- **Secondary:** Ghost style with #E2E8F0 border and #475569 text.
- **Critical:** Solid #B91C1C for "Delete Session" or "Mark Absent" overrides.

### Attendance Badges
Small, high-contrast labels for quick scanning:
- **Present:** Emerald-100 background, Emerald-800 text.
- **Late:** Amber-100 background, Amber-800 text.
- **Absent:** Red-100 background, Red-800 text.

### Data Tables
The core of the system.
- **Headers:** Light gray background (#F1F5F9), uppercase text, 1px bottom border.
- **Rows:** 48px minimum height. Zebra striping is not used; instead, use thin 1px separators (#F1F5F9).
- **Interactive Rows:** Subtle highlight (#F8FAFC) on hover.

### QR Display
- **Container:** White background, 1px border. The QR code itself must have a "quiet zone" of at least 24px padding within its container.
- **Timer:** A progress bar below the QR code using the primary color to indicate the refresh cycle.

### Input Fields
- **Default:** 1px gray border, 12px horizontal padding.
- **Focus:** 2px Blue-600 border with a subtle 2px Blue-100 outer glow.
- **Labels:** Positioned strictly above the field, never as placeholders only.
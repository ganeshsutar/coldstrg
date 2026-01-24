# Design System - shadcn/ui Reference

This document serves as a reference for creating UI designs in Penpot based on the shadcn/ui design system.

## Overview

shadcn/ui is a collection of 70+ reusable components built with Radix UI primitives and styled with Tailwind CSS. It uses CSS custom properties (variables) for theming, enabling seamless light/dark mode support.

---

## Quick Start & Presets

### Default Stack

When creating a new project with `npx shadcn create`, the default configuration includes:

| Setting | Default Value |
|---------|---------------|
| Component Library | Radix UI |
| Style Framework | Vega |
| Base Color | Neutral |
| Icon Library | Lucide |
| Typography | Inter |
| Border Radius | 0.625rem (10px) |

### Available Base Color Presets

shadcn/ui provides five built-in color presets that can be selected during project creation:

| Preset | Description | Primary Tone |
|--------|-------------|--------------|
| **Neutral** | Pure gray, no color cast | Balanced gray |
| **Stone** | Warm gray with slight brown undertone | Warm |
| **Zinc** | Cool gray with blue undertone | Cool |
| **Gray** | Standard gray palette | Neutral |
| **Slate** | Blue-gray, professional feel | Cool blue |

### CLI Commands

```bash
# Create new project with interactive setup
npx shadcn create

# Initialize in existing project
npx shadcn init

# Add specific components
npx shadcn add button card dialog

# View component before installing
npx shadcn view button

# Search available components
npx shadcn search table
```

### CLI Options

| Flag | Description |
|------|-------------|
| `-b, --base-color` | Set base color (neutral, gray, zinc, stone, slate) |
| `-y, --yes` | Skip confirmation prompts |
| `--css-variables` | Enable CSS variable theming (default: true) |
| `-t, --template` | Select project template |

---

## Color System

### Semantic Color Tokens

The design system uses a `background` / `foreground` naming convention:
- Background color: `--primary`
- Text color on that background: `--primary-foreground`

#### Core Semantic Colors

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|------------|-----------|
| `--background` | Page background | `#ffffff` | `#09090b` |
| `--foreground` | Primary text | `#09090b` | `#fafafa` |
| `--card` | Card background | `#ffffff` | `#09090b` |
| `--card-foreground` | Card text | `#09090b` | `#fafafa` |
| `--popover` | Popover background | `#ffffff` | `#09090b` |
| `--popover-foreground` | Popover text | `#09090b` | `#fafafa` |
| `--primary` | Primary actions | `#18181b` | `#fafafa` |
| `--primary-foreground` | Primary action text | `#fafafa` | `#18181b` |
| `--secondary` | Secondary actions | `#f4f4f5` | `#27272a` |
| `--secondary-foreground` | Secondary action text | `#18181b` | `#fafafa` |
| `--muted` | Muted backgrounds | `#f4f4f5` | `#27272a` |
| `--muted-foreground` | Muted text | `#71717a` | `#a1a1aa` |
| `--accent` | Accent highlights | `#f4f4f5` | `#27272a` |
| `--accent-foreground` | Accent text | `#18181b` | `#fafafa` |
| `--destructive` | Error/delete actions | `#ef4444` | `#7f1d1d` |
| `--destructive-foreground` | Destructive text | `#fafafa` | `#fafafa` |
| `--border` | Borders | `#e4e4e7` | `#27272a` |
| `--input` | Input borders | `#e4e4e7` | `#27272a` |
| `--ring` | Focus rings | `#18181b` | `#d4d4d8` |

#### Chart Colors (Data Visualization)

| Token | Suggested Use | Example HEX |
|-------|---------------|-------------|
| `--chart-1` | Primary data | `#2563eb` |
| `--chart-2` | Secondary data | `#16a34a` |
| `--chart-3` | Tertiary data | `#f59e0b` |
| `--chart-4` | Quaternary data | `#8b5cf6` |
| `--chart-5` | Quinary data | `#ec4899` |

#### Sidebar Colors

| Token | Purpose |
|-------|---------|
| `--sidebar` | Sidebar background |
| `--sidebar-foreground` | Sidebar text |
| `--sidebar-primary` | Sidebar primary elements |
| `--sidebar-accent` | Sidebar accent/hover |
| `--sidebar-border` | Sidebar borders |
| `--sidebar-ring` | Sidebar focus rings |

### Base Color Palette (Neutral Scale)

Use these for custom elements. The Neutral palette is the default:

| Shade | HEX | RGB | Usage |
|-------|-----|-----|-------|
| 50 | `#fafafa` | `250, 250, 250` | Lightest backgrounds |
| 100 | `#f5f5f5` | `245, 245, 245` | Light backgrounds |
| 200 | `#e5e5e5` | `229, 229, 229` | Borders, dividers |
| 300 | `#d4d4d4` | `212, 212, 212` | Disabled states |
| 400 | `#a3a3a3` | `163, 163, 163` | Placeholder text |
| 500 | `#737373` | `115, 115, 115` | Secondary text |
| 600 | `#525252` | `82, 82, 82` | Body text (light mode) |
| 700 | `#404040` | `64, 64, 64` | Headings (light mode) |
| 800 | `#262626` | `38, 38, 38` | Primary text (light mode) |
| 900 | `#171717` | `23, 23, 23` | Darkest elements |
| 950 | `#0a0a0a` | `10, 10, 10` | Near black |

### Status Colors

| Status | Color | HEX |
|--------|-------|-----|
| Error/Destructive | Red | `#ef4444` |
| Warning | Amber | `#f59e0b` |
| Success | Green | `#22c55e` |
| Info | Blue | `#3b82f6` |

### Alternative Base Color Palettes

These can be used instead of Neutral when a different aesthetic is desired:

#### Stone (Warm Gray)
| Shade | HEX |
|-------|-----|
| 50 | `#fafaf9` |
| 100 | `#f5f5f4` |
| 200 | `#e7e5e4` |
| 300 | `#d6d3d1` |
| 400 | `#a8a29e` |
| 500 | `#78716c` |
| 600 | `#57534e` |
| 700 | `#44403c` |
| 800 | `#292524` |
| 900 | `#1c1917` |
| 950 | `#0c0a09` |

#### Zinc (Cool Gray)
| Shade | HEX |
|-------|-----|
| 50 | `#fafafa` |
| 100 | `#f4f4f5` |
| 200 | `#e4e4e7` |
| 300 | `#d4d4d8` |
| 400 | `#a1a1aa` |
| 500 | `#71717a` |
| 600 | `#52525b` |
| 700 | `#3f3f46` |
| 800 | `#27272a` |
| 900 | `#18181b` |
| 950 | `#09090b` |

#### Slate (Blue-Gray)
| Shade | HEX |
|-------|-----|
| 50 | `#f8fafc` |
| 100 | `#f1f5f9` |
| 200 | `#e2e8f0` |
| 300 | `#cbd5e1` |
| 400 | `#94a3b8` |
| 500 | `#64748b` |
| 600 | `#475569` |
| 700 | `#334155` |
| 800 | `#1e293b` |
| 900 | `#0f172a` |
| 950 | `#020617` |

---

## Typography

### Font Family

- **Primary Font**: Inter (or system font stack)
- **Monospace**: JetBrains Mono, Menlo, Monaco, Consolas

### Type Scale

| Element | Size | Weight | Line Height | Tracking |
|---------|------|--------|-------------|----------|
| h1 | 36px (4xl) | 800 (extrabold) | 1.2 | tight (-0.025em) |
| h2 | 30px (3xl) | 600 (semibold) | 1.2 | tight (-0.025em) |
| h3 | 24px (2xl) | 600 (semibold) | 1.3 | tight (-0.025em) |
| h4 | 20px (xl) | 600 (semibold) | 1.4 | tight (-0.025em) |
| Lead | 20px (xl) | 400 (normal) | 1.6 | normal |
| Body (p) | 16px (base) | 400 (normal) | 1.75 | normal |
| Large | 18px (lg) | 600 (semibold) | 1.5 | normal |
| Small | 14px (sm) | 500 (medium) | 1.0 | normal |
| Muted | 14px (sm) | 400 (normal) | 1.5 | normal |

### Text Styles in Penpot

Create these text styles:

1. **Heading 1** - 36px, Extrabold, Line height 1.2
2. **Heading 2** - 30px, Semibold, Line height 1.2
3. **Heading 3** - 24px, Semibold, Line height 1.3
4. **Heading 4** - 20px, Semibold, Line height 1.4
5. **Body** - 16px, Regular, Line height 1.75
6. **Body Large** - 18px, Semibold, Line height 1.5
7. **Body Small** - 14px, Medium, Line height 1.0
8. **Muted** - 14px, Regular, Color: `#71717a`
9. **Label** - 14px, Medium, Line height 1.0
10. **Caption** - 12px, Regular, Line height 1.4

---

## Spacing System

Based on Tailwind's 4px base unit:

| Token | Value | Usage |
|-------|-------|-------|
| 0 | 0px | Reset |
| 1 | 4px | Tight spacing |
| 2 | 8px | Compact elements |
| 3 | 12px | Small gaps |
| 4 | 16px | Standard padding |
| 5 | 20px | Medium gaps |
| 6 | 24px | Section padding |
| 8 | 32px | Large gaps |
| 10 | 40px | Section margins |
| 12 | 48px | Page sections |
| 16 | 64px | Large sections |
| 20 | 80px | Hero sections |
| 24 | 96px | Page margins |

### Common Spacing Patterns

- **Button padding**: 16px horizontal, 8px vertical
- **Card padding**: 24px
- **Input padding**: 12px horizontal, 8px vertical
- **Form gap**: 16px between fields
- **Section gap**: 32px - 48px

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements, tags |
| `--radius` | 6px | Default (inputs, buttons) |
| `--radius-md` | 8px | Cards, dialogs |
| `--radius-lg` | 12px | Large cards, modals |
| `--radius-xl` | 16px | Hero sections |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows

| Level | Value | Usage |
|-------|-------|-------|
| sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| base | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards |
| md | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Dropdowns |
| lg | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals |
| xl | `0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)` | Dialogs |

---

## Component Specifications

### Button

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Default | `#18181b` | `#fafafa` | none |
| Secondary | `#f4f4f5` | `#18181b` | none |
| Outline | transparent | `#18181b` | `#e4e4e7` |
| Ghost | transparent | `#18181b` | none |
| Destructive | `#ef4444` | `#fafafa` | none |
| Link | transparent | `#18181b` | none (underline) |

**Sizes:**
| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| xs | 28px | 8px h | 12px | 14px |
| sm | 32px | 12px h | 14px | 16px |
| default | 40px | 16px h | 14px | 16px |
| lg | 44px | 32px h | 16px | 20px |

**Icon-only Sizes:**
| Size | Dimensions |
|------|------------|
| icon-xs | 28x28px |
| icon-sm | 32x32px |
| icon | 40x40px |
| icon-lg | 44x44px |

**Button Features:**
- **Icon Positioning**: Icons can be placed at `inline-start` (left) or `inline-end` (right)
- **Rounded Style**: Apply `rounded-full` for pill-shaped buttons
- **Loading State**: Use a Spinner component inside the button
- **Button Groups**: Group related buttons with consistent spacing
- **AsChild**: Render buttons as links or other elements while maintaining styling

### Input

- **Height**: 40px (default), 32px (sm), 44px (lg)
- **Border**: 1px solid `#e4e4e7`
- **Border Radius**: 6px
- **Padding**: 12px horizontal
- **Focus Ring**: 2px `#18181b` with 2px offset
- **Placeholder Color**: `#a3a3a3`

### Card

- **Background**: `#ffffff` (light) / `#09090b` (dark)
- **Border**: 1px solid `#e4e4e7`
- **Border Radius**: 8px
- **Padding**: 24px
- **Shadow**: base shadow

### Dialog/Modal

- **Background**: `#ffffff`
- **Border Radius**: 12px
- **Padding**: 24px
- **Shadow**: lg shadow
- **Overlay**: `rgba(0,0,0,0.8)`

### Table

- **Header Background**: `#f4f4f5`
- **Row Height**: 48px
- **Cell Padding**: 16px
- **Border**: 1px solid `#e4e4e7` (bottom only)
- **Hover Row**: `#f4f4f5`

### Badge

| Variant | Background | Text |
|---------|------------|------|
| Default | `#18181b` | `#fafafa` |
| Secondary | `#f4f4f5` | `#18181b` |
| Outline | transparent | `#18181b` |
| Destructive | `#ef4444` | `#fafafa` |

- **Height**: 22px
- **Padding**: 10px horizontal
- **Border Radius**: 9999px (pill)
- **Font Size**: 12px

### Avatar

| Size | Dimensions |
|------|------------|
| sm | 32x32px |
| default | 40x40px |
| lg | 48x48px |

- **Border Radius**: 9999px (circle)
- **Fallback Background**: `#f4f4f5`
- **Fallback Text**: `#71717a`

### Tabs

- **Tab Height**: 40px
- **Tab Padding**: 12px horizontal
- **Active Indicator**: 2px bottom border `#18181b`
- **Inactive Text**: `#71717a`
- **Active Text**: `#18181b`

### Checkbox & Radio

- **Size**: 16x16px
- **Border**: 1px solid `#18181b`
- **Border Radius**: 4px (checkbox), 9999px (radio)
- **Checked Background**: `#18181b`
- **Check Mark**: `#fafafa`

### Select

- **Height**: 40px
- **Border**: 1px solid `#e4e4e7`
- **Border Radius**: 6px
- **Dropdown Shadow**: md shadow
- **Option Height**: 36px
- **Option Padding**: 8px 12px

### Toast/Alert

| Variant | Background | Border | Icon Color |
|---------|------------|--------|------------|
| Default | `#ffffff` | `#e4e4e7` | `#18181b` |
| Destructive | `#fef2f2` | `#fecaca` | `#ef4444` |
| Success | `#f0fdf4` | `#bbf7d0` | `#22c55e` |

### Spinner (Loading)

- **Sizes**: 16px, 20px, 24px (match icon sizes)
- **Color**: Inherits from text color or use `--muted-foreground`
- **Animation**: 1s linear infinite rotation
- **Stroke Width**: 2px

### Skeleton (Loading Placeholder)

- **Background**: `#e4e4e7` (light) / `#27272a` (dark)
- **Animation**: Pulse (opacity 1 → 0.5 → 1, 2s duration)
- **Border Radius**: Match the element being loaded
- **Common Patterns**:
  - Text line: height 16px, width varies
  - Avatar: circle, 40x40px
  - Card: full card dimensions with rounded corners

### Progress

- **Track Background**: `#e4e4e7`
- **Fill Color**: `#18181b`
- **Height**: 8px (default), 4px (sm), 12px (lg)
- **Border Radius**: 9999px (pill)

### Separator/Divider

- **Horizontal**: 1px height, 100% width
- **Vertical**: 1px width, 100% height
- **Color**: `#e4e4e7` (light) / `#27272a` (dark)

### Tooltip

- **Background**: `#18181b`
- **Text**: `#fafafa`
- **Padding**: 6px 12px
- **Border Radius**: 6px
- **Font Size**: 14px
- **Max Width**: 300px

---

## Icon System

- **Library**: Lucide Icons (recommended)
- **Default Size**: 16x16px, 20x20px, 24x24px
- **Stroke Width**: 2px
- **Color**: Inherits from text color

---

## Responsive Breakpoints

| Breakpoint | Min Width | Common Usage |
|------------|-----------|--------------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| 2xl | 1536px | Extra large screens |

---

## Penpot Setup Recommendations

### Color Styles to Create

1. Create a "Light Theme" and "Dark Theme" color library
2. Add all semantic colors as named styles
3. Use components with color variables for easy theme switching

### Component Library Structure

```
Components/
├── Buttons/
│   ├── Primary Button
│   ├── Secondary Button
│   ├── Outline Button
│   ├── Ghost Button
│   └── Destructive Button
├── Inputs/
│   ├── Text Input
│   ├── Select
│   ├── Checkbox
│   ├── Radio
│   └── Textarea
├── Cards/
│   ├── Basic Card
│   └── Card with Header
├── Dialogs/
│   ├── Dialog
│   └── Alert Dialog
├── Navigation/
│   ├── Tabs
│   ├── Sidebar
│   └── Breadcrumb
├── Data Display/
│   ├── Table
│   ├── Badge
│   └── Avatar
└── Feedback/
    ├── Toast
    ├── Alert
    └── Progress
```

### States to Design

For interactive components, create variants for:
- Default
- Hover
- Active/Pressed
- Focus
- Disabled
- Error (for inputs)

---

## Resources

### shadcn/ui
- [Create New Project](https://ui.shadcn.com/create) - Interactive project builder with preset customization
- [Documentation](https://ui.shadcn.com/docs) - Full documentation
- [Components](https://ui.shadcn.com/docs/components) - All 70+ components
- [Themes](https://ui.shadcn.com/themes) - Theme customizer and presets
- [Colors](https://ui.shadcn.com/colors) - Color palette reference
- [Blocks](https://ui.shadcn.com/blocks) - Pre-built component compositions

### External
- [Tailwind CSS Colors](https://tailwindcss.com/docs/colors) - Full Tailwind color palette
- [Lucide Icons](https://lucide.dev/icons) - Icon library (2000+ icons)
- [Radix UI Primitives](https://www.radix-ui.com/primitives) - Underlying component primitives
- [Inter Font](https://rsms.me/inter/) - Default typography font
- [Figma shadcn/ui Kit](https://www.figma.com/community/file/1203061493325953101) - Official Figma design kit

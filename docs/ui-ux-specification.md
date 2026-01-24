# ColdVault UI/UX Design Specification

> **Design System:** shadcn/ui + Tailwind CSS
> **Version:** 1.0.0
> **Last Updated:** January 2026

---

## Table of Contents

1. [Design System Configuration](#1-design-system-configuration)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Specifications](#5-component-specifications)
6. [Theming](#6-theming)
7. [Interaction & Accessibility](#7-interaction--accessibility)
8. [User Flows](#8-user-flows)
9. [Responsive Design](#9-responsive-design)

---

## 1. Design System Configuration

### 1.1 shadcn/ui Style Preset

ColdVault uses the **Vega** style preset as its foundation.

| Style | Description | Characteristics |
|-------|-------------|-----------------|
| **Vega** | The classic shadcn/ui look | Balanced spacing, standard border radius, versatile for most applications |
| Nova | Reduced spacing for compact layouts | Tighter padding/margins, efficient screen usage |
| Maia | Soft and rounded with generous spacing | Larger border radius, more whitespace, friendly aesthetic |
| Lyra | Boxy and sharp | Minimal border radius, pairs well with monospace fonts, technical feel |
| Mira | Compact for dense interfaces | Minimal spacing, optimized for data-heavy applications |

**Selected for ColdVault: Vega**
- Provides the established shadcn/ui aesthetic
- Balanced approach suitable for both data entry and dashboard views
- Familiar to users of modern web applications

### 1.2 Base Color

ColdVault uses **Zinc** as its base color palette.

| Base Color | Description | Visual Tone |
|------------|-------------|-------------|
| Gray | Pure, adaptable grays | Neutral |
| **Zinc** | Cool grays with subtle blue undertone | Cool, minimalistic |
| Neutral | Slightly warmer grays | Balanced, versatile |
| Stone | Warm grays with brown undertone | Earthy, natural |
| Slate | Blue-gray tones | Professional, digital |

**Selected for ColdVault: Zinc**
- Cool undertones convey professionalism
- Excellent for data-intensive interfaces
- High contrast for readability

### 1.3 Border Radius

ColdVault uses **0.5rem (8px)** as the base border radius.

| Option | Value | Visual Effect |
|--------|-------|---------------|
| None | 0rem | Sharp, angular corners |
| Subtle | 0.3rem | Slightly softened edges |
| **Default** | 0.5rem | Modern, balanced roundness |
| Medium | 0.75rem | Noticeably rounded |
| Full | 1.0rem | Very rounded, soft appearance |

**Selected for ColdVault: 0.5rem (8px)**

| Derived Token | Calculation | Result |
|---------------|-------------|--------|
| `radius-sm` | `radius - 4px` | 4px |
| `radius` | base | 8px |
| `radius-md` | `radius + 4px` | 12px |
| `radius-lg` | `radius + 8px` | 16px |
| `radius-xl` | `radius + 16px` | 24px |
| `radius-full` | 9999px | Circular/pill |

### 1.4 Additional Configuration

| Setting | Selection | Rationale |
|---------|-----------|-----------|
| **Icon Library** | Lucide | Comprehensive icon set, consistent stroke width |
| **Font** | Inter | Excellent readability, wide language support |
| **Component Library** | Radix UI | Accessible primitives, unstyled flexibility |

---

## 2. Color System

### 2.1 Zinc Base Scale

| Shade | HEX | Usage |
|-------|-----|-------|
| 50 | `#fafafa` | Lightest backgrounds, hover states |
| 100 | `#f4f4f5` | Secondary backgrounds, muted areas |
| 200 | `#e4e4e7` | Borders, dividers |
| 300 | `#d4d4d8` | Disabled borders |
| 400 | `#a1a1aa` | Placeholder text |
| 500 | `#71717a` | Secondary text |
| 600 | `#52525b` | Body text (light mode) |
| 700 | `#3f3f46` | Dark mode secondary |
| 800 | `#27272a` | Dark mode backgrounds |
| 900 | `#18181b` | Primary text |
| 950 | `#09090b` | Darkest, page background (dark) |

### 2.2 Semantic Colors

| Token | Light Mode | Dark Mode | Purpose |
|-------|------------|-----------|---------|
| `background` | `#ffffff` | `#09090b` | Page background |
| `foreground` | `#09090b` | `#fafafa` | Primary text |
| `card` | `#ffffff` | `#09090b` | Card surfaces |
| `card-foreground` | `#09090b` | `#fafafa` | Card text |
| `popover` | `#ffffff` | `#09090b` | Dropdown backgrounds |
| `popover-foreground` | `#09090b` | `#fafafa` | Dropdown text |
| `primary` | `#18181b` | `#fafafa` | Primary actions |
| `primary-foreground` | `#fafafa` | `#18181b` | Primary action text |
| `secondary` | `#f4f4f5` | `#27272a` | Secondary actions |
| `secondary-foreground` | `#18181b` | `#fafafa` | Secondary text |
| `muted` | `#f4f4f5` | `#27272a` | Muted backgrounds |
| `muted-foreground` | `#71717a` | `#a1a1aa` | Subtle text |
| `accent` | `#f4f4f5` | `#27272a` | Highlights, hover |
| `accent-foreground` | `#18181b` | `#fafafa` | Accent text |
| `destructive` | `#ef4444` | `#7f1d1d` | Error, delete |
| `destructive-foreground` | `#fafafa` | `#fafafa` | Error text |
| `border` | `#e4e4e7` | `#27272a` | Borders |
| `input` | `#e4e4e7` | `#27272a` | Input borders |
| `ring` | `#18181b` | `#d4d4d8` | Focus rings |

### 2.3 Status Colors

| Status | Color | HEX | Usage |
|--------|-------|-----|-------|
| Success | Green | `#22c55e` | Completed actions, positive balance (Cr) |
| Warning | Amber | `#f59e0b` | Temperature alerts, approaching limits |
| Error | Red | `#ef4444` | Validation errors, overdue payments |
| Info | Blue | `#3b82f6` | Information, links |

### 2.4 Chart Colors

| Token | HEX | Assigned Data |
|-------|-----|---------------|
| `chart-1` | `#2563eb` | Stock value, primary metrics |
| `chart-2` | `#16a34a` | Income, credits |
| `chart-3` | `#f59e0b` | Pending items |
| `chart-4` | `#8b5cf6` | Expenses, debits |
| `chart-5` | `#ec4899` | Overdue items |

### 2.5 Sidebar Colors

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `sidebar` | `#fafafa` | `#18181b` |
| `sidebar-foreground` | `#3f3f46` | `#f4f4f5` |
| `sidebar-primary` | `#18181b` | `#2563eb` |
| `sidebar-primary-foreground` | `#fafafa` | `#ffffff` |
| `sidebar-accent` | `#f4f4f5` | `#27272a` |
| `sidebar-accent-foreground` | `#18181b` | `#f4f4f5` |
| `sidebar-border` | `#e4e4e7` | `#27272a` |

---

## 3. Typography

### 3.1 Font Family

| Type | Font Stack |
|------|------------|
| **Sans-serif** | Inter, system-ui, -apple-system, sans-serif |
| **Monospace** | JetBrains Mono, Menlo, Monaco, Consolas, monospace |
| **Hindi** | Noto Sans Devanagari, Mangal, Kokila, sans-serif |

### 3.2 Type Scale

| Style | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| **Display** | 48px | Bold (700) | 1.1 | -0.02em |
| **H1** | 36px | Extrabold (800) | 1.2 | -0.025em |
| **H2** | 30px | Semibold (600) | 1.2 | -0.025em |
| **H3** | 24px | Semibold (600) | 1.3 | -0.025em |
| **H4** | 20px | Semibold (600) | 1.4 | -0.025em |
| **Lead** | 20px | Normal (400) | 1.6 | 0 |
| **Body** | 16px | Normal (400) | 1.75 | 0 |
| **Body Large** | 18px | Medium (500) | 1.5 | 0 |
| **Body Small** | 14px | Normal (400) | 1.5 | 0 |
| **Label** | 14px | Medium (500) | 1.0 | 0 |
| **Caption** | 12px | Normal (400) | 1.4 | 0 |
| **Muted** | 14px | Normal (400) | 1.5 | 0 |

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Base unit: 4px

| Token | Value | Common Usage |
|-------|-------|--------------|
| `1` | 4px | Icon-text gap |
| `2` | 8px | Compact elements, inline spacing |
| `3` | 12px | Small gaps, input padding |
| `4` | 16px | Standard padding, form gaps |
| `5` | 20px | Medium gaps |
| `6` | 24px | Card padding, section gaps |
| `8` | 32px | Large gaps |
| `10` | 40px | Section margins |
| `12` | 48px | Page sections |
| `16` | 64px | Large sections |
| `20` | 80px | Hero sections |

### 4.2 Shadows

| Level | Value | Usage |
|-------|-------|-------|
| **sm** | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| **base** | `0 1px 3px rgba(0,0,0,0.1)` | Cards, inputs |
| **md** | `0 4px 6px rgba(0,0,0,0.1)` | Dropdowns, popovers |
| **lg** | `0 10px 15px rgba(0,0,0,0.1)` | Modals |
| **xl** | `0 20px 25px rgba(0,0,0,0.1)` | Dialogs |

### 4.3 Application Shell Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Header (h: 56px)                                             │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                 │
│  Sidebar   │              Main Content                       │
│  (w: 256px)│              (padding: 24px)                    │
│            │                                                 │
│            │  ┌─────────────────────────────────────────┐   │
│            │  │ Breadcrumbs                              │   │
│            │  ├─────────────────────────────────────────┤   │
│            │  │                                          │   │
│            │  │           Page Content                   │   │
│            │  │           (max-width: 1440px)            │   │
│            │  │                                          │   │
│            │  └─────────────────────────────────────────┘   │
│            │                                                 │
└────────────┴─────────────────────────────────────────────────┘
```

| Element | Dimension |
|---------|-----------|
| Header height | 56px |
| Sidebar width (expanded) | 256px |
| Sidebar width (collapsed) | 64px |
| Content padding | 24px |
| Content max-width | 1440px |

---

## 5. Component Specifications

### 5.1 Button

**Sizes:**

| Size | Height | Horizontal Padding | Font Size | Icon Size |
|------|--------|-------------------|-----------|-----------|
| xs | 28px | 8px | 12px | 14px |
| sm | 32px | 12px | 14px | 16px |
| default | 40px | 16px | 14px | 16px |
| lg | 44px | 32px | 16px | 20px |
| icon | 40x40px | - | - | 16px |

**Variants:**

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Default | `primary` | `primary-foreground` | none |
| Secondary | `secondary` | `secondary-foreground` | none |
| Outline | transparent | `foreground` | `border` |
| Ghost | transparent | `foreground` | none |
| Destructive | `destructive` | `destructive-foreground` | none |
| Link | transparent | `primary` | none (underline) |

**States:**

| State | Visual Change |
|-------|---------------|
| Default | Base styling |
| Hover | 90% opacity background |
| Active | 80% opacity, slight scale down |
| Focused | Focus ring (2px) |
| Disabled | 50% opacity |
| Loading | Spinner icon replaces content |

### 5.2 Input

**Dimensions:**

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 32px | 8px 12px | 14px |
| default | 40px | 8px 12px | 14px |
| lg | 44px | 10px 14px | 16px |

**Specifications:**

| Property | Value |
|----------|-------|
| Border | 1px solid `input` |
| Border Radius | `radius` (8px) |
| Placeholder Color | `muted-foreground` |
| Focus Ring | 2px `ring`, 2px offset |

**States:**

| State | Border | Background | Other |
|-------|--------|------------|-------|
| Default | `input` | `background` | - |
| Hover | `zinc-400` | - | - |
| Focused | transparent | - | Ring visible |
| Disabled | `input` | `muted` | 50% opacity |
| Error | `destructive` | - | Error message below |

### 5.3 Checkbox

| Property | Value |
|----------|-------|
| Size | 16x16px |
| Border | 1px solid `primary` |
| Border Radius | 4px |
| Checked Background | `primary` |
| Check Icon | 12px, `primary-foreground` |

**States:**

| State | Visual |
|-------|--------|
| Unchecked | Border only |
| Checked | Filled + check icon |
| Indeterminate | Filled + minus icon |
| Focused | Focus ring |
| Disabled | 50% opacity |

### 5.4 Select (Dropdown)

**Trigger:**

| Property | Value |
|----------|-------|
| Height | 40px |
| Padding | 8px 12px |
| Border | 1px solid `input` |
| Border Radius | `radius` |
| Chevron | 16px, right aligned |

**Content:**

| Property | Value |
|----------|-------|
| Background | `popover` |
| Border | 1px solid `border` |
| Border Radius | `radius` |
| Shadow | `shadow-md` |
| Max Height | 300px (scrollable) |

**Item:**

| Property | Value |
|----------|-------|
| Height | 36px |
| Padding | 8px 12px 8px 32px |
| Hover | `accent` background |
| Selected | Check icon + `accent` |

### 5.5 Popover

| Property | Value |
|----------|-------|
| Background | `popover` |
| Border | 1px solid `border` |
| Border Radius | `radius-md` (12px) |
| Shadow | `shadow-md` |
| Padding | 16px |
| Min Width | 200px |
| Max Width | 400px |
| Offset from trigger | 4px |

### 5.6 Dialog (Modal)

**Overlay:**

| Property | Value |
|----------|-------|
| Background | `rgba(0, 0, 0, 0.8)` |
| Backdrop Filter | `blur(4px)` (optional) |

**Content:**

| Property | Value |
|----------|-------|
| Width | 425px (sm), 600px (lg), 800px (xl) |
| Background | `background` |
| Border | 1px solid `border` |
| Border Radius | `radius-lg` (16px) |
| Shadow | `shadow-xl` |

**Sections:**

| Section | Padding |
|---------|---------|
| Header | 24px 24px 0 |
| Content | 24px |
| Footer | 0 24px 24px |

### 5.7 Toast Notification

| Property | Value |
|----------|-------|
| Width | 356px (desktop), 100% (mobile) |
| Padding | 16px |
| Border Radius | `radius-md` |
| Shadow | `shadow-lg` |
| Position | Bottom-right (desktop), bottom-center (mobile) |
| Duration | 5000ms |
| Max Visible | 3 stacked |

**Variants:**

| Variant | Background | Border | Icon |
|---------|------------|--------|------|
| Default | `background` | `border` | None |
| Success | `#f0fdf4` | `#bbf7d0` | CheckCircle (green) |
| Error | `#fef2f2` | `#fecaca` | XCircle (red) |
| Warning | `#fffbeb` | `#fde68a` | AlertTriangle (amber) |
| Info | `#eff6ff` | `#bfdbfe` | Info (blue) |

### 5.8 Skeleton Loader

| Property | Value |
|----------|-------|
| Background | `muted` |
| Animation | Pulse (opacity 1 → 0.5 → 1) |
| Duration | 2s |
| Border Radius | Matches target element |

### 5.9 Data Table

**Container:**

| Property | Value |
|----------|-------|
| Border | 1px solid `border` |
| Border Radius | `radius` |

**Header:**

| Property | Value |
|----------|-------|
| Background | `muted` |
| Height | 48px |
| Font | 12px, Medium, Uppercase |
| Color | `muted-foreground` |
| Padding | 12px 16px |

**Body Row:**

| Property | Value |
|----------|-------|
| Height | 52px |
| Border | 1px bottom `border` |
| Padding | 12px 16px |
| Font | 14px |
| Hover | `muted/50` background |
| Selected | `muted` background |

### 5.10 Card

| Property | Value |
|----------|-------|
| Background | `card` |
| Border | 1px solid `border` |
| Border Radius | `radius` |
| Shadow | `shadow-sm` |

**Sections:**

| Section | Padding |
|---------|---------|
| Header | 24px 24px 0 |
| Content | 24px |
| Footer | 0 24px 24px |

### 5.11 Sidebar

**Dimensions:**

| Property | Expanded | Collapsed |
|----------|----------|-----------|
| Width | 256px | 64px |
| Header Height | 56px | 56px |

**Menu Button:**

| Property | Value |
|----------|-------|
| Height | 40px |
| Padding | 8px 12px |
| Border Radius | `radius` |
| Icon-Text Gap | 12px |

**States:**

| State | Background | Text |
|-------|------------|------|
| Default | transparent | `sidebar-foreground` |
| Hover | `sidebar-accent` | `sidebar-accent-foreground` |
| Active | `sidebar-primary` | `sidebar-primary-foreground` |

### 5.12 Breadcrumbs

| Property | Value |
|----------|-------|
| Font Size | 14px |
| Gap | 6px |
| Link Color | `muted-foreground` |
| Link Hover | `foreground` |
| Current Item | `foreground`, Medium weight |
| Separator | ChevronRight icon, 16px |

---

## 6. Theming

### 6.1 Light Mode Variables

| Variable | HSL Value | HEX |
|----------|-----------|-----|
| `--background` | 0 0% 100% | #ffffff |
| `--foreground` | 240 10% 3.9% | #09090b |
| `--card` | 0 0% 100% | #ffffff |
| `--card-foreground` | 240 10% 3.9% | #09090b |
| `--popover` | 0 0% 100% | #ffffff |
| `--popover-foreground` | 240 10% 3.9% | #09090b |
| `--primary` | 240 5.9% 10% | #18181b |
| `--primary-foreground` | 0 0% 98% | #fafafa |
| `--secondary` | 240 4.8% 95.9% | #f4f4f5 |
| `--secondary-foreground` | 240 5.9% 10% | #18181b |
| `--muted` | 240 4.8% 95.9% | #f4f4f5 |
| `--muted-foreground` | 240 3.8% 46.1% | #71717a |
| `--accent` | 240 4.8% 95.9% | #f4f4f5 |
| `--accent-foreground` | 240 5.9% 10% | #18181b |
| `--destructive` | 0 84.2% 60.2% | #ef4444 |
| `--destructive-foreground` | 0 0% 98% | #fafafa |
| `--border` | 240 5.9% 90% | #e4e4e7 |
| `--input` | 240 5.9% 90% | #e4e4e7 |
| `--ring` | 240 5.9% 10% | #18181b |
| `--radius` | - | 0.5rem |

### 6.2 Dark Mode Variables

| Variable | HSL Value | HEX |
|----------|-----------|-----|
| `--background` | 240 10% 3.9% | #09090b |
| `--foreground` | 0 0% 98% | #fafafa |
| `--card` | 240 10% 3.9% | #09090b |
| `--card-foreground` | 0 0% 98% | #fafafa |
| `--popover` | 240 10% 3.9% | #09090b |
| `--popover-foreground` | 0 0% 98% | #fafafa |
| `--primary` | 0 0% 98% | #fafafa |
| `--primary-foreground` | 240 5.9% 10% | #18181b |
| `--secondary` | 240 3.7% 15.9% | #27272a |
| `--secondary-foreground` | 0 0% 98% | #fafafa |
| `--muted` | 240 3.7% 15.9% | #27272a |
| `--muted-foreground` | 240 5% 64.9% | #a1a1aa |
| `--accent` | 240 3.7% 15.9% | #27272a |
| `--accent-foreground` | 0 0% 98% | #fafafa |
| `--destructive` | 0 62.8% 30.6% | #7f1d1d |
| `--destructive-foreground` | 0 0% 98% | #fafafa |
| `--border` | 240 3.7% 15.9% | #27272a |
| `--input` | 240 3.7% 15.9% | #27272a |
| `--ring` | 240 4.9% 83.9% | #d4d4d8 |

---

## 7. Interaction & Accessibility

### 7.1 Focus Ring

| Property | Value |
|----------|-------|
| Width | 2px |
| Color | `ring` |
| Offset | 2px |
| Offset Color | `background` |

**Behavior:**
- Only visible on keyboard navigation (`:focus-visible`)
- Applied to all interactive elements
- Focus trapped within modals/dialogs

### 7.2 Keyboard Navigation

**Global Shortcuts:**

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Open command palette |
| `Ctrl/Cmd + /` | Toggle sidebar |
| `Escape` | Close modal/popover |
| `Tab` | Next focusable element |
| `Shift + Tab` | Previous focusable element |

**Component Navigation:**

| Component | Keys | Action |
|-----------|------|--------|
| Select | `Space/Enter` | Open/select |
| Select | `↑/↓` | Navigate options |
| Dialog | `Tab` | Cycle elements |
| Dialog | `Escape` | Close |
| Table | `↑/↓` | Navigate rows |
| Table | `Space` | Toggle selection |
| Tabs | `←/→` | Switch tabs |

### 7.3 Color Contrast

Minimum contrast ratios (WCAG 2.1 AA):

| Content Type | Required Ratio | Achieved |
|--------------|----------------|----------|
| Normal text | 4.5:1 | 19.4:1 (foreground/background) |
| Large text | 3:1 | 4.6:1 (muted-foreground/background) |
| UI components | 3:1 | Compliant |

### 7.4 Motion

| Type | Duration | Easing |
|------|----------|--------|
| Micro-interactions | 150ms | ease-out |
| Page transitions | 200ms | ease-in-out |
| Modal open/close | 200ms | ease-out |
| Hover effects | 150ms | ease |

**Reduced Motion:** All animations respect `prefers-reduced-motion` media query.

---

## 8. User Flows

### 8.1 User Onboarding

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌────────┐
│  Sign Up │───►│  Verify  │───►│  Create/ │───►│  Setup   │───►│ Dash-  │
│   Form   │    │  Email   │    │ Join Org │    │  Wizard  │    │ board  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └────────┘
```

**Step 1: Sign Up Form**
- Components: Card, Input (name, email, password, phone), Checkbox (terms), Button
- Validation: Real-time inline validation

**Step 2: Email Verification**
- Components: Card, OTP Input (6 digits), Button (verify, resend)
- Timer: 60-second resend countdown

**Step 3: Organization Setup**
- Components: Tabs (Create/Join), Input, Select (state), Button
- Option to skip if joining via invite

**Step 4: Setup Wizard**
- Components: Card, Progress, Accordion, Checkbox (completion)
- Tasks: Add commodities, configure rooms, add parties, set preferences

### 8.2 Stock Arrival (Amad)

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌────────┐
│  Select  │───►│  Enter   │───►│  Assign  │───►│  Review  │───►│Confirm │
│  Party   │    │  Details │    │   Room   │    │ & Submit │    │Receipt │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └────────┘
```

**Components Used:**
- Combobox (party search with autocomplete)
- Select (commodity, room, category)
- Input (packets, weight, marka)
- Card (summary)
- Dialog (confirmation)
- Toast (success notification)

### 8.3 Party Registration

**Layout Sections:**

| Section | Fields |
|---------|--------|
| **Basic Info** | Full Name, Father/Husband Name, Name (Hindi), Phone, Village, Guarantor |
| **Identification** | Aadhaar, PAN, GST (collapsible) |
| **Financial Settings** | Opening Balance, Interest Rate, Debit Limit |
| **Bank Details** | Bank Name, Account No, IFSC (collapsible) |

**Components:**
- Tabs (Kissan/Vyapari type selector)
- Input, Select, Combobox
- Collapsible sections for optional fields
- Button (Save)

---

## 9. Responsive Design

### 9.1 Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640-1023px | Collapsible sidebar |
| Desktop | 1024-1279px | Full sidebar |
| Large | ≥ 1280px | Expanded content, max-width container |

### 9.2 Component Adaptations

| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Sidebar | Expanded (256px) | Collapsed (64px) | Sheet overlay |
| Dialog | Centered modal | Centered modal | Full-screen sheet |
| Data Table | Full columns | Reduced columns | Card-based list |
| Forms | Multi-column | Single column | Single column |
| Navigation | Sidebar + header | Sidebar | Bottom nav + hamburger |

### 9.3 Touch Targets

Minimum size: **44x44px**

| Element | Desktop | Mobile |
|---------|---------|--------|
| Button height | 40px | 44px |
| Menu item height | 36px | 48px |
| Table row height | 52px | 60px |
| Checkbox tap area | 16px (visual) | 44px (tap area) |

---

## Appendix: Quick Reference

### Design Configuration Summary

| Setting | Value |
|---------|-------|
| **Style** | Vega |
| **Base Color** | Zinc |
| **Radius** | 0.5rem (8px) |
| **Font** | Inter |
| **Icons** | Lucide |
| **Component Library** | Radix UI |

### Key Measurements

| Element | Value |
|---------|-------|
| Header height | 56px |
| Sidebar width | 256px / 64px |
| Button height (default) | 40px |
| Input height (default) | 40px |
| Card padding | 24px |
| Table row height | 52px |
| Focus ring | 2px, 2px offset |
| Border radius | 8px (base) |

---

**Sources:**
- [shadcn/ui Create](https://ui.shadcn.com/create)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui Colors](https://ui.shadcn.com/colors)
- [shadcn Style Presets Announcement](https://x.com/shadcn/status/1999530419125981676)

---

*Document Version: 1.0.0*
*Last Updated: January 2026*

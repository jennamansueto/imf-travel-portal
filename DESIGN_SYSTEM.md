# IMF Travel Portal — Design System

## Design Decisions

### Visual Identity
Inspired by IMF's public-facing tools at imf.org — dark navy primary, clean sans-serif typography, institutional and professional feel. The portal uses white/gray backgrounds with navy accents to feel data-heavy yet breathable.

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Navy | `#002855` | Nav, headers, primary buttons, branding |
| Accent Blue | `#0073CF` | Links, interactive elements, hover states |
| Success Green | `#16A34A` | Approved status, validation pass |
| Warning Amber | `#D97706` | Returned/pending status, warnings |
| Error Red | `#DC2626` | Rejected status, validation errors |
| Neutral 50 | `#F8FAFC` | Page backgrounds |
| Neutral 100 | `#F1F5F9` | Card backgrounds, zebra rows |
| Neutral 200 | `#E2E8F0` | Borders, dividers |
| Neutral 500 | `#64748B` | Secondary text, labels |
| Neutral 900 | `#0F172A` | Body text |

### Typography
- **Font Family:** Inter (Google Fonts) — clean, professional, excellent readability
- **Page Titles:** 24px / semibold
- **Section Headers:** 18px / semibold
- **Field Labels:** 14px / medium, uppercase tracking for form labels
- **Body Text:** 14px / regular
- **Small Text:** 12px / regular (timestamps, metadata)

### Spacing
- 4px/8px grid system
- Page padding: 24px (desktop), 16px (tablet)
- Card padding: 24px
- Section gaps: 24px
- Form field gaps: 16px

### Components
- **Cards:** White background, `border-gray-200`, `rounded-lg`, no shadow or subtle `shadow-sm`
- **Status Badges:** Color-coded pills with icon prefix (e.g., ● Draft, ✓ Approved)
- **Tables:** Header bg `slate-50`, hover `slate-50`, clear column borders
- **Buttons:** Primary (navy bg, white text), Secondary (outlined), Destructive (red)
- **Inputs:** Top-aligned labels, `border-gray-300`, focus ring `accent-blue`

### Navigation
- **Left Sidebar:** 260px width, collapsible, navy background with white text
- **Top Bar:** White background, bottom border, breadcrumbs + search + user area
- **Role Switcher:** Dropdown in top bar showing current role with colored indicator

### Accessibility (WCAG 2.1 AA)
- All interactive elements have visible focus rings
- Color is never the sole indicator — always paired with text or icons
- ARIA labels on all buttons and interactive elements
- Keyboard-navigable throughout
- Minimum contrast ratio 4.5:1 for normal text

### Animations
- Page transitions: 150ms fade-in
- Accordion expansions: 200ms ease-out
- Status changes: 300ms highlight flash
- Button loading: spinner + disabled state
- Modals: backdrop blur + slide-up 200ms

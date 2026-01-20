# 🎨 Dashboard Visual Guide

## Color Palette

### Primary Colors
- **Purple-Blue Gradient**: `#667eea` → `#764ba2`
- **Primary Blue**: `#667eea`
- **Accent Purple**: `#764ba2`

### Safety Score Colors
- **Safe (Green)**: `#4caf50` - Score 80-100
- **Moderate (Orange)**: `#ff9800` - Score 60-79
- **High Risk (Red)**: `#f44336` - Score 0-59

### Resource Status Colors
- **High Availability**: `#4caf50` (70-100%)
- **Medium Availability**: `#ff9800` (40-69%)
- **Low Availability**: `#f44336` (20-39%)
- **Critical**: `#b71c1c` (0-19%) - Pulsing animation

### Supporting Colors
- **Background**: `#f8f9ff` (Light blue-gray)
- **Card Background**: `rgba(255, 255, 255, 0.95)`
- **Text Primary**: `#333`
- **Text Secondary**: `#666`
- **Border**: `#e0e0e0`

---

## Typography

### Font Family
```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

### Font Sizes
- **Main Title**: `2.5rem` (40px)
- **Card Title**: `1.5rem` (24px)
- **Body Text**: `1rem` (16px)
- **Small Text**: `0.9rem` (14px)
- **Safety Score**: `3rem` (48px)

---

## Layout Breakpoints

### Desktop (1200px+)
```
┌─────────────────────────────────────┐
│          Header (Full Width)        │
├───────────┬───────────┬─────────────┤
│  Safety   │ Disaster  │  Resources  │
│   Score   │   Chart   │   Tracker   │
│           │           │             │
└───────────┴───────────┴─────────────┘
```

### Tablet (768-1199px)
```
┌─────────────────────────────┐
│       Header (Full)         │
├──────────────┬──────────────┤
│ Safety Score │ Disaster Data│
├──────────────┴──────────────┤
│      Resource Tracker       │
└─────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────┐
│    Header    │
├──────────────┤
│ Safety Score │
├──────────────┤
│Disaster Chart│
├──────────────┤
│  Resources   │
└──────────────┘
```

---

## Component Styles

### Card Style
```css
background: rgba(255, 255, 255, 0.95);
border-radius: 15px;
padding: 25px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
```

### Button Style
```css
/* Primary Button */
background: #667eea;
color: white;
padding: 10px 20px;
border-radius: 8px;
transition: all 0.3s;

/* Hover */
background: #5568d3;
transform: translateY(-2px);
```

### Score Circle
```css
width: 200px;
height: 200px;
border-radius: 50%;
font-size: 3rem;
color: white;
box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
/* Dynamic gradient based on score */
```

---

## Icons & Emojis

### Feature Icons
- 🛡️ Safety Score
- 📈 Disaster Data
- 📦 Resource Tracker
- 🌍 Earthquakes
- 🌊 Floods
- 🌀 Hurricanes
- 🔥 Wildfires

### Resource Icons
- 🏠 Shelters
- 🏥 Medical
- 🍽️ Food
- 💧 Water

### Action Icons
- 🔄 Refresh
- ⚠️ Alert
- ✅ Available
- 📍 Location
- ← Back

---

## Animations

### Hover Effects
```css
.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
```

### Pulsing Alert
```css
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}
```

### Smooth Transitions
```css
transition: all 0.3s ease;
```

---

## UI States

### Loading State
- Show: "Detecting location..."
- Show: "Loading data..."
- Skeleton screens (optional)

### Error State
- Location unavailable message
- Fallback to default location
- Retry button

### Success State
- Green checkmarks
- Confirmation messages
- Data displayed

### Alert State
- Red banner at top
- Pulsing indicators
- High-contrast warnings

---

## Accessibility

### Color Contrast
- Text on white: `#333` (AAA compliant)
- White on colored buttons (AA compliant)
- High contrast mode available

### Focus States
```css
:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
}
```

### Screen Reader
- Semantic HTML
- ARIA labels where needed
- Alt text for visuals
- Descriptive button text

---

## Spacing System

### Padding Scale
- Small: `10px`
- Medium: `15px`
- Large: `20px`
- Extra Large: `25px`

### Margin Scale
- Small: `10px`
- Medium: `20px`
- Large: `30px`
- Section: `40px`

### Gap (Grid/Flex)
- Cards: `25px`
- Filters: `10px`
- Buttons: `15px`

---

## Shadow System

### Light Shadow
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
```

### Medium Shadow
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
```

### Heavy Shadow
```css
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
```

### Glow Effect
```css
box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
```

---

## Chart Styling

### Line Chart
- Line thickness: `2px`
- Point radius: `4px`
- Tension: `0.4` (smooth curves)
- Fill: Semi-transparent gradient
- Grid lines: Light gray

### Colors
- Earthquakes: `#ff6384` (Pink)
- Floods: `#36a2eb` (Blue)
- Hurricanes: `#ffce56` (Yellow)
- Wildfires: `#ff9f40` (Orange)

---

## Progress Bars

### Structure
```
┌─────────────────────┐
│███████░░░░░░░░░░░  │ 70%
└─────────────────────┘
```

### Colors (by capacity)
- 70-100%: Green
- 40-69%: Orange
- 20-39%: Red
- 0-19%: Dark Red

### Size
- Width: `100px`
- Height: `8px`
- Border radius: `5px`

---

## Responsive Images

### Score Circle
- Desktop: `200px × 200px`
- Mobile: `150px × 150px`

### Icons
- Standard: `24px × 24px`
- Large: `48px × 48px`
- Extra Large: `120px × 120px`

---

## Loading & Performance

### Skeleton Screens
- Use background: `#e0e0e0`
- Add shimmer animation
- Match actual content layout

### Lazy Loading
- Charts load on scroll
- Images load on demand
- Progressive enhancement

---

## Print Styles

```css
@media print {
    .back-button,
    .refresh-btn,
    .filters {
        display: none;
    }
    
    .card {
        page-break-inside: avoid;
    }
    
    body {
        background: white;
    }
}
```

---

## Dark Mode (Future)

### Planned Colors
- Background: `#1a1a2e`
- Cards: `#16213e`
- Text: `#eee`
- Accent: `#667eea`

---

## Visual Hierarchy

### Priority 1 (Most Important)
- Safety Score number
- Critical alerts
- Resource status badges

### Priority 2 (Important)
- Charts
- Resource details
- Location info

### Priority 3 (Supporting)
- Filters
- Timestamps
- Back button

---

**Design Philosophy**: Clean, modern, accessible, and data-focused

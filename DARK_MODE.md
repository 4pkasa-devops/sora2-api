# 🌙 Dark Mode Configuration

This application uses **shadcn/ui's dark mode** and is **permanently set to dark theme** by default.

## How It Works

### 1. HTML Class
The dark mode is enforced at the root level in `app/layout.tsx`:

```tsx
<html lang="en" className="dark">
```

The `className="dark"` on the `<html>` element tells Tailwind CSS to use dark mode variants for all components.

### 2. Tailwind Configuration
Tailwind CSS 4 with shadcn/ui automatically applies dark mode styles when the `.dark` class is present on the HTML element.

### 3. Color Scheme
The application uses shadcn's dark mode color palette defined in `app/globals.css`:

- **Background**: Dark slate tones (oklch-based colors)
- **Foreground**: Light text for readability
- **Cards**: Slightly lighter dark backgrounds
- **Primary**: Light colors that stand out on dark backgrounds
- **Accents**: Purple and pink gradients for branding
- **Muted**: Subtle grays for secondary content

## Visual Design

### Color Palette
- **Background**: Deep slate/charcoal (`from-slate-950 to-slate-900`)
- **Text**: Light gray/white for high contrast
- **Primary Actions**: Purple-pink gradient
- **Cards**: Dark with subtle borders
- **Success**: Green tones
- **Warning**: Amber tones
- **Error**: Red tones

### Key Components
- **Header**: Purple-pink gradient icon with white text
- **Cards**: Dark background with rounded corners
- **Buttons**: Primary uses gradient, secondary uses outlined style
- **Inputs**: Dark background with light text
- **Progress bars**: Gradient fills
- **Badges**: Color-coded status indicators
- **Modals**: Dark with backdrop blur

## Benefits of Dark Mode

✅ **Reduced eye strain** during extended use  
✅ **Better for low-light environments**  
✅ **Modern aesthetic** that matches current design trends  
✅ **OLED-friendly** saves battery on supported displays  
✅ **Professional appearance** for video production tools  
✅ **Consistent with OpenAI brand** dark interface style  

## Customization

If you want to switch to light mode or make it toggleable:

### Option 1: Remove Dark Mode (Light Mode Only)
In `app/layout.tsx`, remove the `dark` class:
```tsx
<html lang="en">  // Remove className="dark"
```

### Option 2: Add Theme Toggle
Install a theme provider and add a toggle button. You would need:
1. Create a theme provider component
2. Add theme toggle button to the UI
3. Store theme preference in localStorage

### Option 3: System Theme (Auto)
Use the system's preference:
```tsx
// Add this to detect system theme
<html lang="en" className={systemTheme}>
```

## Current Implementation

**Status**: ✅ Dark mode permanently enabled  
**Method**: HTML class-based (`className="dark"`)  
**Toggle**: Not implemented (always dark)  
**Customizable**: Yes, by editing `app/layout.tsx`  

## Color Variables

All colors are defined in `app/globals.css` under the `.dark` selector:

```css
.dark {
  --background: oklch(0.145 0 0);       /* Very dark */
  --foreground: oklch(0.985 0 0);       /* Almost white */
  --card: oklch(0.205 0 0);             /* Dark card */
  --primary: oklch(0.922 0 0);          /* Light primary */
  --muted: oklch(0.269 0 0);            /* Muted dark */
  --accent: oklch(0.269 0 0);           /* Accent dark */
  /* ... more variables */
}
```

## Browser Compatibility

Dark mode works on all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

## Accessibility

The dark mode implementation follows accessibility best practices:
- **Contrast ratios** meet WCAG AA standards
- **Focus indicators** are visible
- **Interactive elements** have clear hover states
- **Text is readable** with sufficient contrast
- **No color-only indicators** (uses icons + color)

---

**Enjoy the sleek dark interface! 🌙✨**


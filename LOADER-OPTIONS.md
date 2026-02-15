# Professional Loading Animations - Options

I've replaced the zoom in/out effect with a **professional spinning circle loader**. But here are multiple options you can choose from:

---

## ✅ CURRENT: Spinning Circle with Glow (Default)

**What it looks like:**
- Logo in center
- Gold spinning circle around logo
- Subtle pulsing glow
- "LOADING..." text with animated dots
- Gradient dark green background

**Effect:** Modern, professional, smooth

---

## Other Professional Loader Options

### Option 2: Progress Bar Loader

Add this to your HTML (replace current loader):

```html
<div class="page-loader">
    <div class="loader-content">
        <img src="assets/icons/logo.svg" alt="Stryde Coaching" style="height: 80px; margin-bottom: 30px;">
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <p class="loader-text">Loading Experience</p>
    </div>
</div>
```

Add this CSS:

```css
.progress-bar {
    width: 300px;
    height: 4px;
    background-color: rgba(203, 180, 132, 0.2);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 20px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--cream));
    animation: progressLoad 1.5s ease-in-out;
    border-radius: 2px;
}

@keyframes progressLoad {
    0% { width: 0; }
    100% { width: 100%; }
}
```

---

### Option 3: Three Dots Loader

Add this HTML:

```html
<div class="page-loader">
    <div class="loader-content">
        <img src="assets/icons/logo.svg" alt="Stryde Coaching" style="height: 80px; margin-bottom: 30px;">
        <div class="dots-loader">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</div>
```

Add this CSS:

```css
.dots-loader {
    display: flex;
    gap: 12px;
}

.dots-loader span {
    width: 12px;
    height: 12px;
    background-color: var(--gold);
    border-radius: 50%;
    animation: dotsBounce 1.4s infinite ease-in-out both;
}

.dots-loader span:nth-child(1) { animation-delay: -0.32s; }
.dots-loader span:nth-child(2) { animation-delay: -0.16s; }

@keyframes dotsBounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}
```

---

### Option 4: Minimal Fade In (Fastest)

Add this HTML:

```html
<div class="page-loader">
    <div class="loader-logo">
        <img src="assets/icons/logo.svg" alt="Stryde Coaching" style="height: 100px;">
    </div>
</div>
```

Add this CSS:

```css
.page-loader {
    background-color: var(--dark-green);
}

.loader-logo {
    animation: simpleFade 0.8s ease-in-out;
}

@keyframes simpleFade {
    0% { opacity: 0; transform: translateY(-20px); }
    100% { opacity: 1; transform: translateY(0); }
}
```

---

### Option 5: Circular Wave Loader

Add this HTML:

```html
<div class="page-loader">
    <div class="loader-logo">
        <img src="assets/icons/logo.svg" alt="Stryde Coaching" style="height: 80px;">
        <div class="wave-circle"></div>
        <div class="wave-circle" style="animation-delay: 0.5s;"></div>
        <div class="wave-circle" style="animation-delay: 1s;"></div>
    </div>
</div>
```

Add this CSS:

```css
.loader-logo {
    position: relative;
}

.wave-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border: 2px solid var(--gold);
    border-radius: 50%;
    animation: waveExpand 2s infinite ease-out;
    opacity: 0;
}

@keyframes waveExpand {
    0% {
        width: 100px;
        height: 100px;
        opacity: 1;
    }
    100% {
        width: 200px;
        height: 200px;
        opacity: 0;
    }
}
```

---

## How to Change Loader

### Step 1: Update HTML

In **ALL your HTML files** (index.html, about.html, services.html, testimonials.html, contact.html), find the page loader section and replace it with your chosen option.

Current location (right after `<body>` tag):

```html
<body>
    <!-- Page Loader -->
    <div class="page-loader">
        <div class="loader-logo">
            <img src="assets/icons/logo.svg" alt="Stryde Coaching" style="height: 80px;">
        </div>
        <p class="loader-text">LOADING</p>
    </div>
```

### Step 2: Update CSS

In `css/enhanced-main.css`, find the "LOADING ANIMATION" section and replace with your chosen CSS.

### Step 3: Adjust Timing (Optional)

In `js/enhanced-main.js`, you can change how long the loader shows:

```javascript
setTimeout(() => {
    loader.classList.add('hidden');
}, 1000); // Change this number (milliseconds)
```

- `500` = 0.5 seconds (very fast)
- `1000` = 1 second (current)
- `1500` = 1.5 seconds (slower, more visible)

---

## Current Loader Details

**What's included now:**
- Spinning gold circle
- Pulsing outer glow
- Smooth fade in/out
- "LOADING..." text with animated dots
- Gradient background

**To disable the loader completely:**

In `js/enhanced-main.js`, change timeout to 0:

```javascript
setTimeout(() => {
    loader.classList.add('hidden');
}, 0); // Loads instantly
```

---

## Recommendations

**For speed:** Use Option 4 (Minimal Fade)
**For elegance:** Use current spinning circle (already applied)
**For visibility:** Use Option 2 (Progress Bar)
**For fun:** Use Option 3 (Three Dots)
**For impact:** Use Option 5 (Circular Waves)

---

## Testing Your Loader

1. Save changes
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Reload page to see loader
4. Test on slow connection (Chrome DevTools > Network > Slow 3G)

---

**Current loader is modern and professional!** But feel free to switch to any option above. 🚀

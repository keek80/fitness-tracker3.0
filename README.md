# 🏋️ Fat Loss Transformation Tracker

A Progressive Web App (PWA) for tracking a 385 → 250 lb fat loss transformation journey. Tracks weigh-ins, gym progress, meal plans, and provides visual analytics — all from your phone.

## 📱 Features

- **📊 Dashboard** — Live stats: current weight, total lost, gym sessions, milestone progress
- **⚖️ Weigh-In Tracker** — Log weekly weight with projected vs. actual chart
- **💪 Gym Log** — Track weight & reps for all exercises across a 4-day Upper/Lower split
- **📈 Analytics** — Weight trends, gym volume charts, personal records, win rate stats
- **🛠️ Exercise Manager** — Add, edit, delete, and reorder exercises and training days
- **🍽️ Meal Plan** — Full 6-meal plan with macros and meal prep tips
- **🏋️ Training Program** — Complete exercise reference cards with coaching cues
- **⚙️ Settings** — Customize goals, export/import data backups

## 🚀 Deploy (Choose One)

### Option 1: Netlify Drop (30 seconds)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this entire folder onto the page
3. Done — open the URL on your phone

### Option 2: GitHub Pages (Free)
1. Push this repo to GitHub
2. Go to **Settings → Pages → Source: Deploy from a branch → main → / (root)**
3. Your app is live at `https://yourusername.github.io/repo-name/`

### Option 3: Vercel (Free)
1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. One-click deploy

## 📲 Install on Android
1. Open the deployed URL in **Chrome**
2. Tap **⋮ menu → "Add to Home Screen"** (or look for the install banner)
3. App appears on your home screen — opens full-screen, works offline

## 📲 Install on iPhone
1. Open the deployed URL in **Safari**
2. Tap **Share → "Add to Home Screen"**

## 🗂️ Project Structure

```
├── index.html          # Main app shell
├── manifest.json       # PWA manifest (app name, icons, theme)
├── sw.js               # Service worker (offline caching)
├── .nojekyll           # GitHub Pages compatibility
├── css/
│   └── styles.css      # All app styles
├── js/
│   ├── data.js         # Training program, meal plan, client profile data
│   ├── storage.js      # LocalStorage manager (CRUD operations)
│   ├── dashboard.js    # Dashboard page renderer
│   ├── weighin.js      # Weigh-in page with Chart.js graph
│   ├── gym.js          # Gym log page (weight/reps tracking)
│   ├── analytics.js    # Analytics with charts and stats
│   ├── exercises.js    # Exercise Manager (add/edit/delete/reorder)
│   ├── meals.js        # Meal plan viewer
│   ├── program.js      # Training program reference cards
│   ├── settings.js     # Settings, export/import, data management
│   └── app.js          # Main app controller (navigation, init, SW registration)
└── icons/
    ├── icon-192.png    # App icon 192x192
    └── icon-512.png    # App icon 512x512
```

## 💾 Data Storage

All data is stored **locally on your device** using `localStorage`. Nothing is sent to any server.

- **Export** your data anytime from Settings → Export Data (saves as JSON)
- **Import** data on a new device from Settings → Import Data

## 🔧 Customization

- Edit exercises directly in the app via the **🛠️ Exercise Manager**
- Adjust start weight, goal weight, and weekly target in **⚙️ Settings**
- Meal plan and training data can be modified in `js/data.js`

## 📋 Program Details

| Metric | Value |
|---|---|
| Start Weight | 385 lbs |
| Goal Weight | 250 lbs |
| Daily Calories | ~2,500 kcal |
| Protein Target | ~250g |
| Training Split | 4-day Upper/Lower |
| Timeline | 18–24 months |

## 📄 License

MIT License — free to use and modify.

<div align="center">

<br>

# 🌀 F O R O M

### The Finite Rom Map (FRM)

**An open-source, category-driven 2D navigation engine for modern content platforms**

<br>

[![React 19](https://img.shields.io/badge/React-19.2-087EA4?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite 7](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind 4](https://img.shields.io/badge/Tailwind-4.1-0EA5E9?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-E036C9?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-EF9421?style=for-the-badge&logo=creativecommons&logoColor=white)](https://creativecommons.org/licenses/by-sa/4.0/)

<br>

[Features](#-features) · [Quick Start](#-quick-start) · [Architecture](#-architecture) · [Color System](#-color-system) · [Economy & Leveling](#-economy--leveling-system) · [Contributing](#-contributing)

<br>

---

</div>

<br>

## 🧭 Overview

**Forom** is an infinite 2D feed grid that reinvents how users navigate content. Scroll horizontally through items, vertically through categories — all driven by physics-based spring animations and a distinctive curved wheel sidebar.

Built as a real platform for the **ÉTS (École de technologie supérieure)** student community, Forom powers video discovery, memory cards, quest systems, and a token-based economy — all inside a single responsive interface.

> **Fork it. Remix it. Build your own universe on top of it.**

<br>

## ✨ Features

### Core Navigation

| | Feature | Description |
|---|---------|-------------|
| 🎯 | **5×5 Infinite Grid** | Seamless 2D viewport into a 20-item-per-category virtual grid with infinite horizontal looping |
| 🎡 | **Wheel Sidebar** | Curved, spring-animated category selector with mouse wheel capture & cooldown |
| ⚡ | **Gesture Navigation** | Bi-directional mouse wheel scrolling with resistance-based physics |
| 🔄 | **Dual-Axis Controls** | Slider tracks + arrow buttons for both horizontal and vertical navigation |
| 📐 | **Viewport Scaling** | Fully `vw`/`vh`-based sizing — adapts to any screen without breakpoints |

### Content & Interactive Systems

| | Feature | Description |
|---|---------|-------------|
| 🎬 | **Video Grid** | YouTube-integrated video boxes with thumbnail previews and modal playback |
| 🧠 | **Memory Cards** | WH-question-based knowledge cards (Qui? Quoi? Où? Quand? Comment? Combien? Pourquoi?) |
| 💰 | **Wallet & Token Economy** | In-app currency system with wallet modal — fully modifiable (see [Economy System](#-economy--leveling-system)) |
| 🏆 | **Quest System** | Guided missions and objectives via a dedicated quest modal |
| ❤️ | **Heart FAB** | Floating action button for community support interactions |
| 🌗 | **Dark / Light Mode** | Full theme toggle with smooth transitions and CSS variable theming |

<br>

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** 9+ (or pnpm / yarn)
- **Docker** *(optional — for containerized deployment)*

### Install & Run

```bash
# Clone
git clone https://github.com/your-org/forom.git
cd forom

# Install dependencies
npm install

# Launch dev server
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** and start exploring.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (`--host` enabled) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

### Docker

```bash
docker build -t forom .
docker run -p 80:80 forom
```

Serves the optimized Nginx build on port 80.

<br>

## 🏗 Architecture

```
forom/
├── database.sql               # PostgreSQL schema (users, categories, memos)
├── Dockerfile                 # Multi-stage Node → Nginx build
├── index.html                 # SPA entry point
│
└── src/
    ├── App.tsx                # Root component — state, modals, layout
    ├── index.css              # Global styles, CSS variables, @font-face
    ├── main.tsx               # React DOM entry
    │
    ├── assets/
    │   ├── fonts/             # Custom typography (Jersey 15)
    │   └── icons/             # UI icons (PNG)
    │
    ├── components/
    │   ├── CarouselGrid.tsx   # 5×5 grid engine — navigation, rendering, state
    │   ├── Header.tsx         # Animated FOROM logo + action icons
    │   ├── Sidebar.tsx        # Curved wheel category selector
    │   ├── VideoBox.tsx       # Individual video cell with YouTube thumbnail
    │   ├── VideoModal.tsx     # Full-screen video player overlay
    │   ├── MemoryBox.tsx      # WH-question memory card cell
    │   ├── MemoryModal.tsx    # Memory detail viewer / editor
    │   ├── WalletModal.tsx    # Token wallet & currency display
    │   ├── QuestModal.tsx     # Quest / mission system modal
    │   └── HeartFAB.tsx       # Floating heart action button
    │
    └── data/
        ├── videos.ts          # Video metadata by category (YouTube IDs)
        └── memories.ts        # Memory card data, WH-question types & colors
```

### Core Components

#### `CarouselGrid`
The rendering heart of Forom. Manages a **5×5 visible window** into a larger virtual grid:
- **20 items per category** on the horizontal axis
- **Infinite horizontal looping** — seamless wrap-around
- **Category boundaries** on the vertical axis
- **Click-to-focus** — tap any visible cell to center it
- Orchestrates `VideoBox` and `MemoryBox` rendering

#### `Sidebar`
The signature curved wheel for category navigation:
- Spring-physics positioning via Framer Motion
- Mouse wheel capture with debounced cooldown
- Auto-syncs with `CarouselGrid` active state

#### `Header`
Animated branding bar with:
- Spring-animated FOROM letterforms
- Action icon triggers (wallet, quests)
- Dark/light mode awareness

#### `VideoBox` / `MemoryBox`
Individual grid cells that render either:
- **Video content** — YouTube thumbnail + playback modal
- **Memory cards** — WH-question label, colored borders, detail modal

#### Modals
- **`WalletModal`** — Token balance, transaction history, currency management
- **`QuestModal`** — Active quests, progress tracking, rewards
- **`VideoModal`** — Embedded YouTube player overlay
- **`MemoryModal`** — Full memory viewer with rich descriptions

<br>

## 🎨 Color System

Forom uses a carefully crafted palette where each category has a signature color that cascades through borders, highlights, and UI accents.

### Category Colors

| Category | Color | Hex | Preview |
|----------|-------|-----|---------|
| **Partenaires** | Sage Green | `#86B89E` | ![#86B89E](https://img.shields.io/badge/-%2386B89E-86B89E?style=flat-square) |
| **Culture** | Lavender Purple | `#C084FC` | ![#C084FC](https://img.shields.io/badge/-%23C084FC-C084FC?style=flat-square) |
| **Clubs** | Coral Red | `#E85C5C` | ![#E85C5C](https://img.shields.io/badge/-%23E85C5C-E85C5C?style=flat-square) |
| **Trésorie** | Warm Amber | `#F4C98E` | ![#F4C98E](https://img.shields.io/badge/-%23F4C98E-F4C98E?style=flat-square) |
| **Atelier** | Sky Blue | `#60A5FA` | ![#60A5FA](https://img.shields.io/badge/-%2360A5FA-60A5FA?style=flat-square) |

### WH-Question Colors (Memory Cards)

| Question | Color | Hex | Preview |
|----------|-------|-----|---------|
| **QUI?** | Amber | `#F59E0B` | ![#F59E0B](https://img.shields.io/badge/-%23F59E0B-F59E0B?style=flat-square) |
| **QUOI?** | Gold | `#FACC15` | ![#FACC15](https://img.shields.io/badge/-%23FACC15-FACC15?style=flat-square) |
| **OÙ?** | Lime | `#84CC16` | ![#84CC16](https://img.shields.io/badge/-%2384CC16-84CC16?style=flat-square) |
| **QUAND?** | Emerald | `#10B981` | ![#10B981](https://img.shields.io/badge/-%2310B981-10B981?style=flat-square) |
| **COMMENT?** | Cerulean | `#0EA5E9` | ![#0EA5E9](https://img.shields.io/badge/-%230EA5E9-0EA5E9?style=flat-square) |
| **COMBIEN?** | Indigo | `#4F46E5` | ![#4F46E5](https://img.shields.io/badge/-%234F46E5-4F46E5?style=flat-square) |
| **POURQUOI?** | Violet | `#8B5CF6` | ![#8B5CF6](https://img.shields.io/badge/-%238B5CF6-8B5CF6?style=flat-square) |

### Theme Modes

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| Background | `#FFFFFF` | `#0f0f0f` |
| Surface | `#F8F8F8` | `#1a1a1a` |
| Text Primary | `#1a1a1a` | `#f0f0f0` |
| Border | `#e5e7eb` | `#2a2a2a` |

Colors are driven by CSS custom properties in `index.css` and toggled via the `.dark` class on `<html>`.

<br>

## 💎 Economy & Leveling System

Forom ships with a **modifiable token economy** and a **leveling system** scaffold. These are designed to be forked, tweaked, and extended to fit your community's needs.

### Token Economy

The `currency` field in the `users` table (`database.sql`) tracks each user's balance. The `WalletModal` component provides the frontend interface.

**How it works (default):**
- Users earn tokens by completing quests, watching videos, or filling memory cards
- Tokens can be spent on unlocking content, customizations, or community perks
- Admins and operators can grant/revoke tokens via the database

**Modifying the economy:**
```sql
-- database.sql — user currency field
currency INTEGER DEFAULT 0
```
Change the default starting balance, add decimal support (`NUMERIC(10,2)`), or introduce multiple currency types by adding columns.

**Frontend hook points:**
- `WalletModal.tsx` — Display and transaction UI
- `QuestModal.tsx` — Reward distribution logic
- `HeartFAB.tsx` — Social tipping interactions

### Leveling System

The database schema supports a role-based system (`admin`, `operator`, `user`). Extend it into a full leveling system:

```sql
-- Example: Add leveling fields to users table
ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN title VARCHAR(50) DEFAULT 'Newcomer';
```

**Suggested level thresholds (modifiable):**

| Level | XP Required | Title | Perks |
|-------|-------------|-------|-------|
| 1 | 0 | Newcomer | Basic access |
| 2 | 100 | Contributor | Can create memories |
| 3 | 500 | Explorer | Unlocks hidden categories |
| 4 | 1500 | Curator | Can moderate content |
| 5 | 5000 | Guardian | Full admin capabilities |

> **This is a scaffold, not a prescription.** Change XP curves, add prestige resets, introduce seasonal ranks — make it yours.

<br>

## 🧩 Extending Forom

### Adding Categories

1. Add the category name to `CATEGORIES` in `App.tsx`
2. Add the color mapping in `CATEGORY_COLORS` in `CarouselGrid.tsx`
3. Optionally add a row in the `category` table in `database.sql`
4. The grid automatically expands — no layout changes needed

### Custom Content Types

Replace or extend the grid cell renderers in `CarouselGrid.tsx`:

```tsx
// Swap VideoBox for your own component
<YourContentComponent id={num} category={category} color={categoryColor} />
```

### Theming

Global styles live in `index.css`. Key customization points:
- `:root` / `.dark` CSS variables for all color tokens
- `@font-face` declarations for custom typography
- Tailwind theme extensions in `tailwind.config.ts`

<br>

## ⚙️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev) | 19.2 | Component framework |
| [TypeScript](https://typescriptlang.org) | 5.9 | Static type safety |
| [Vite](https://vitejs.dev) | 7.2 | Lightning-fast build tooling |
| [Tailwind CSS](https://tailwindcss.com) | 4.1 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | 12.x | Spring-physics animations |
| [Lucide React](https://lucide.dev) | 0.563 | Icon library |
| [React Modal](https://github.com/reactjs/react-modal) | 3.16 | Accessible modal dialogs |
| [PostCSS](https://postcss.org) | 8.5 | CSS transformation pipeline |
| [Docker](https://docker.com) / [Nginx](https://nginx.org) | — | Containerized production deployment |
| [PostgreSQL](https://postgresql.org) | — | Database layer (schema provided) |

<br>

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style (ESLint enforced)
- Use TypeScript strict mode
- Write meaningful commit messages
- Update documentation for new features
- Keep animations performant — prefer `transform` and `opacity`

### Ideas for Contribution

- [ ] Touch / swipe gesture support for mobile
- [ ] Keyboard navigation (arrow keys + vim bindings)
- [ ] Virtual scrolling for massive datasets
- [ ] Content lazy loading & skeleton states
- [ ] Accessibility improvements (ARIA roles, screen reader support)
- [ ] Mobile-first responsive breakpoints
- [ ] Custom animation preset library
- [ ] Plugin system for pluggable content types
- [ ] **Modifiable economy system** — multi-currency, marketplace, trading
- [ ] **Leveling system** — XP curves, prestige, seasonal ranks, achievements
- [ ] Backend API (Express / Fastify) for persistent data
- [ ] Real-time collaboration via WebSockets
- [ ] i18n / multi-language support
- [ ] Analytics dashboard for content engagement

<br>

## 📊 Database Schema

The included `database.sql` provides a PostgreSQL schema with three tables:

| Table | Purpose |
|-------|---------|
| `users` | User accounts with roles (`admin`, `operator`, `user`), currency balance, and profile data |
| `category` | Dynamic category registry with title and hex color |
| `memos` | Memory card content linked to users and categories, with WH-question types |

> This schema is a starting point. Extend it with leveling tables, transaction logs, achievement records, or anything your community needs.

<br>

## 📜 License

<a href="https://creativecommons.org/licenses/by-sa/4.0/">
  <img src="https://licensebuttons.net/l/by-sa/4.0/88x31.png" alt="CC BY-SA 4.0" />
</a>

This work is licensed under the **[Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/)**.

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any purpose, even commercially

Under the following terms:
- **Attribution** — You must give appropriate credit to **Forom**, provide a link to the license, and indicate if changes were made
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license

© 2024-2026 [Forom](https://github.com/forom)

---

<div align="center">

<br>

**Built with ❤️ by the Forom community**

*The future of content navigation is finite.*

<br>

</div>

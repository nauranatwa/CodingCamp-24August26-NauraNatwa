# Life Dashboard — Project Steering

## Overview

A personal productivity dashboard built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies. Open `index.html` directly in a browser to run it.

## Project Structure

```
index.html          — single-page app shell
css/style.css       — all styles, one file
js/script.js        — all logic, one file
```

## Tech Constraints

- Vanilla HTML, CSS, and JavaScript only — do not introduce frameworks, libraries, or package managers.
- Keep exactly one CSS file (`css/style.css`) and one JavaScript file (`js/script.js`).
- No build step. The project runs by opening `index.html` directly.

## Features

- Time-based greeting with optional custom user name
- Live clock and date display
- Focus (Pomodoro) timer with adjustable duration, Start / Stop / Reset
- To-do list: add, edit (inline form), mark done, delete, optional note per task, duplicate prevention, sort (default / A→Z / Z→A / pending first)
- Quick Links: add named URLs, delete, open in new tab
- Light / Dark mode toggle
- All user data persisted via `localStorage` (tasks, links, name, theme, Pomodoro duration)

## localStorage Keys

| Key               | Value                          |
|-------------------|-------------------------------|
| `tasks`           | JSON array of task objects     |
| `quickLinks`      | JSON array of link objects     |
| `userName`        | string                         |
| `theme`           | `"light"` or `"dark"`          |
| `pomodoroMinutes` | number (default 25)            |

## Code Conventions

- No comments in source files.
- Use `function` declarations and `function` expressions (not arrow functions) to match existing style.
- DOM manipulation is done imperatively — no virtual DOM, no templates.
- CSS uses a `body.light` class for light mode overrides; dark mode is the default (no class needed).
- Semantic HTML elements are used where appropriate (`<header>`, `<main>`, `<section>`, `<nav>`, `<time>`, `<form>`, `<label>`).

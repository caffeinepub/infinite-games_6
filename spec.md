# Infinite Games

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Full game portal site called "Infinite Games" with neon blue/purple theme
- Animated canvas background with floating purple particle network (connected lines)
- Games loaded from gn-math CDN (zones.json) -- all available games displayed as cards
- Search bar to filter games by name
- Recently Played section (stored in localStorage) showing last 8 played games
- Settings panel with: light/dark mode toggle, panic key configuration (hotkey that redirects tab to Google), save button
- Tab cloaking: document.title set to "Google" and favicon replaced with Google's favicon on load
- Game opening: loads HTML content into an about:blank new tab window (proxy-style)
- Games that have external http URLs open via DuckDuckGo proxy: `https://duckduckgo.com/?q=!ducky+<url>`

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Frontend: App.tsx with canvas particle background, header with search, games grid, recently played section, settings modal
2. Games loaded from `https://cdn.jsdelivr.net/gh/gn-math/assets@main/zones.json`
3. Recently played stored/read from localStorage
4. Tab cloaking applied on mount (title=Google, favicon=Google)
5. Panic key listener on keydown, configured in settings
6. Settings saved to localStorage
7. Game card click: fetch HTML from CDN, open about:blank window, write HTML to it

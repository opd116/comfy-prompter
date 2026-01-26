## 2026-01-26 - Lazy Loading Dialogs in Virtualized Lists
**Learning:** Even with `@tanstack/react-virtual`, rendering heavy child components (like Dialogs) inside list items causes significant initialization overhead (hooks, logic) even if they are visually hidden or not portaled yet.
**Action:** Use state-based lazy mounting (`mounted && <Dialog />`) for any interactive sub-components in list items to defer their cost until user interaction.

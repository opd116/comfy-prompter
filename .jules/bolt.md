## 2025-02-18 - [Lazy Loading Dialogs in Lists]
**Learning:** Rendering hidden dialog components inside list items (even when virtualized) can significantly impact performance due to initialization logic (like regex parsing) running on mount.
**Action:** Always lazy mount dialogs or heavy interactive components that are initially hidden using a state flag (e.g. `isMounted` or `hasOpened`), especially in `VirtualizedPromptGrid` or similar list views.

## 2025-02-18 - [Regex in Render Body]
**Learning:** Expensive operations like regex parsing in the component body run on every render.
**Action:** Memoize these operations with `useMemo` to prevent re-calculation, especially in interactive components like forms or dialogs.

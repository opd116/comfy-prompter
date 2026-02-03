## 2025-02-19 - Lazy Loading Dialogs in Lists
**Learning:** Even with `React.memo` and virtualization, child components that perform expensive logic on mount (like regex parsing in `PromptFillDialog`) can accumulate significant cost. Virtualization only limits the DOM nodes, but if 20 items are rendered and each runs regex, it adds up.
**Action:** Always check if heavy child components can be lazy-mounted (conditionally rendered) only when user interaction occurs, especially in list items.

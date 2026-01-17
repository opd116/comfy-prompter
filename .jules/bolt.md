# Bolt's Journal

## 2024-05-22 - IntersectionObserver Overhead
**Learning:** `LazyImage` was creating a new `IntersectionObserver` for every instance. In a virtualized list, this can cause significant overhead during rapid scrolling.
**Action:** Implemented a shared singleton `IntersectionObserver` manager that handles all `LazyImage` instances efficiently.

## 2024-05-22 - Unconditional Regex in Dialog
**Learning:** `PromptFillDialog` runs `extractPlaceholders` (regex) on every render of its parent `PromptCard`, even if the dialog is closed.
**Action:** Future optimization should memoize this calculation or move it inside the dialog component so it only runs when open.

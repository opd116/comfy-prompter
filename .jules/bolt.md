## 2026-02-04 - Lazy Mounting Dialogs in Lists
**Learning:** `PromptFillDialog` performs synchronous regex parsing (`extractPlaceholders`) on render. Since it was unconditionally rendered in `PromptCard` (which appears in `VirtualizedPromptGrid`), this overhead was incurred for every visible card, impacting scrolling performance.
**Action:** Always lazy mount heavy dialog components (conditional rendering based on open state) inside list items to avoid unnecessary initialization costs.

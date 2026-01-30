## 2024-05-23 - List Virtualization and Lazy Dialogs
**Learning:** Large lists using `react-window` or `@tanstack/react-virtual` can still be slow if the row components render heavy children, even if those children are visually hidden (like Dialogs).
**Action:** Always lazy mount heavy dialogs or popovers inside list items. Use a `mounted` state to only render them after the first interaction. Also, ensure expensive initialization logic (like parsing regex) in children is memoized.

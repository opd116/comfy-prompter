## 2025-05-22 - Lazy Rendering of Heavy Dialogs
**Learning:** Hidden Dialog components (like `PromptFillDialog`) that perform expensive initialization (regex parsing) on render can significantly impact performance of large lists, even if virtualized. The `PromptCard` was rendering 50+ instances of `PromptFillDialog` initially, each parsing prompt content.
**Action:** Always conditionally render heavy Dialogs or defer their expensive logic until they are actually opened. Use a "mounted" state flag to keep them mounted after first open if exit animations are required.

## 2025-05-19 - Dialog Performance in Virtual Lists
**Learning:** Unconditional rendering of hidden dialogs in virtualized list items (like `PromptCard`) causes significant initialization overhead (e.g., regex parsing in `PromptFillDialog`) even if the dialog is never opened.
**Action:** Implement lazy mounting using local state (e.g., `hasOpened`) to defer dialog component rendering until the first user interaction.

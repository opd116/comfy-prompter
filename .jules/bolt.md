## 2024-05-23 - Render Optimization for Search Inputs
**Learning:** Controlled inputs in a parent component that renders a large tree (like a list of items) can cause significant performance degradation because every keystroke triggers a full re-render of the tree.
**Action:** Move the input state into the input component itself (`SearchBar`). Only notify the parent of changes after a debounce or commit (Enter key). This isolates the high-frequency updates to the small input component. Use a `key` prop controlled by the parent to reset the input state when necessary (e.g., "Clear Filters").

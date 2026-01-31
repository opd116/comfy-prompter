## 2024-05-22 - Lazy Loading Heavy Dialogs in List
**Learning:** Initializing components that perform expensive calculations on mount (like regex parsing in `PromptFillDialog`) inside a virtualized list causes significant performance overhead, even if the components are not visible (e.g., hidden dialogs).
**Action:** Use conditional rendering or state-based lazy mounting (`mounted && <Dialog />`) to defer initialization of such components until they are actually needed (e.g., on first user interaction).

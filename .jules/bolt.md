## 2024-05-22 - [Context Thrashing Fix]
**Learning:** High-frequency updates (like performance metrics) in a React Context consumed by components that also dispatch actions can cause a "re-render storm" or even infinite loops if not handled carefully.
**Action:** Always split Context into `StateContext` (for data) and `ActionsContext` (for methods) when the data updates frequently but the actions are stable. This prevents consumers of actions from re-rendering when data changes.

## 2026-01-22 - [Context Thrashing Loop]
**Learning:** Consolidating state (metrics) and actions (updateMetric) in a single Context triggered an infinite re-render loop. A component (`VirtualizedPromptGrid`) updated a metric in `useEffect`, which updated Context state, which re-rendered the component (context consumer), which triggered `useEffect` again.
**Action:** Split high-frequency update Contexts into `StateContext` and `ActionsContext`. Ensure `ActionsContext` value is stable (useMemo) and independent of changing state.

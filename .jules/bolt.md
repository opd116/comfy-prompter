## 2024-03-24 - Efficient Search Index Caching
**Learning:** Rebuilding derived data structures (like search indexes) for an entire list when only one item changes is a common bottleneck, even with `useMemo`.
**Action:** Use a `WeakMap` cached in a `useRef` to store derived data keyed by the source object reference. This allows granular reuse of expensive computations (like string concatenation/lowercasing) when the source array changes but individual item references remain stable. This pattern effectively implements "per-item memoization" inside a `map` loop.

# Bolt's Journal

## 2024-05-22 - [Initial Setup]
**Learning:** This is a fresh start for Bolt in this repo.
**Action:** Always check for this file before starting to avoid repeating past mistakes.

## 2024-05-22 - [Optimizing Derived State]
**Learning:** In derived state (`useMemo`), if the input array changes reference but most items are unchanged, we can reuse the expensive derived data for those items by caching the previous results (e.g., using `useRef`).
**Action:** When optimizing `useMemo` that maps over a list, consider if partial updates are common and if caching can avoid expensive re-computation.

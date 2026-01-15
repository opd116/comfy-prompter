## 2024-05-23 - `useSearchIndex` Optimization
**Learning:** Recomputing search indices (string concatenation + lowercasing) for large lists is expensive. Even with `useMemo`, if the dependency array changes (e.g. one item in the list updates), the *entire* list is reprocessed.
**Action:** Use a `useRef` cache inside `useMemo` to store fine-grained computations. Iterate over the list and reuse cached results for items that haven't changed (checking specific fields if the object reference changes), transforming O(N*L) work into O(N) reference checks.

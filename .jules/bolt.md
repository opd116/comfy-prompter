## 2026-01-19 - Context Splitting Misconception
**Learning:** The previous memory indicated that `PerformanceContext` was already split into State and Actions contexts. Upon inspection, it was a single monolithic context causing widespread re-renders. This highlights the importance of verifying architectural claims in documentation/memory against the actual code.
**Action:** Always verify 'known' architectural patterns in the code before assuming they are implemented correctly.

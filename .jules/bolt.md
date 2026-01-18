## 2024-05-23 - PromptFillDialog Regex Bottleneck
**Learning:** `PromptFillDialog` was executing a regex-based `extractPlaceholders` on every render. Since the component has controlled inputs (custom text field), this caused the regex to run on every keystroke, which is an unnecessary performance cost.
**Action:** Always check for expensive operations (regex, deep traversals) in the render body of components with controlled inputs. Use `useMemo` to cache results that only depend on props.

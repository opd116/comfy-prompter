## 2024-05-22 - PromptCard Performance Optimization
**Learning:** Hidden dialogs in list items were causing performance issues because they were fully rendered (and executing expensive logic like regex parsing) even when not visible.
**Action:** Use "lazy mounting" state pattern (`mounted && <Dialog />`) to defer rendering of heavy interactive components until they are first requested by the user.

## 2024-05-22 - Lockfile Churn
**Learning:** Running `npm install` in this environment caused massive unrelated changes to `package-lock.json`, which pollutes the PR.
**Action:** Always check `git diff` or file changes after `npm install` and revert `package-lock.json` if no dependencies were intentionally added/updated.

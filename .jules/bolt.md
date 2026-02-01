## 2024-05-22 - Lazy Loading Dialogs in Virtualized Lists
**Learning:** Components inside virtualized list items are constantly mounted/unmounted. Heavy initialization in children (like Dialogs parsing content) happens frequently.
**Action:** Always lazy-mount heavy modal/dialog components inside list items using state flags, so they only initialize upon first interaction.

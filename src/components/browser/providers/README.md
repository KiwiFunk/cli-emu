Skins should follow this structure:
```
providers/
  ├── [ProviderName]/              # e.g., Azure/ or GitHub/
  │   ├── Layout.tsx               # The persistent App Shell (Navbars, Sidebars)
  │   ├── views/                   # The main content pages
  │   │   ├── IndexView.tsx        # Shows list of repos
  │   │   ├── RepoView.tsx         # Shows the file explorer
  │   │   └── CreateView.tsx       # The page for creating a repo (if applicable)
  │   └── components/              # Skin-specific UI (Buttons, Modals, specific icons)
  │       └── CreateModal.tsx      # If the skin uses a modal instead of a page
```

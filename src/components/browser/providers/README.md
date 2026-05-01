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
When creating provider skins, we create a `Layout` component that serves as the persistent shell of the application. This is where persistant elements such as navbars, sidebars etc. live. We then have a `views` directory that contains the main content pages that get swapped in and out based on user interaction. Finally, we have a `components` directory for any provider-specific UI elements such as buttons, modals, or icons.

 ### How do layouts know their state?
 Becuase the Zustand store sits outside of the React tree, we can make use of it to pull information such as the current 'url' in our in-app browser, or use hooks such as 'useFileExplorer' to pull the current file tree state and dynamically render the layout based on that. 
 
 ### Modal vs Pages
  Some providers may choose to use modals for certain interactions (e.g. ADO) instead of navigating to a new page (e.g. GitHub). In this case, the modal component would be placed in the `components/` directory of the provider's folder. 
  
  Instead of simply using `view === 'CREATE_FORM'`, we split the routing state into two parts.
  1. `activePage` - What is the main content underneath? (e.g. 'INDEX', 'REPO')
  2. `activeModal` - Is there a modal open on top of that page> (e.g. 'CREATE_FORM' or null).
  This gives us more flexibility with handling different UI patterns across providers, while still keeping the routing logic consistent. For example:
  - GitHub Skin: When the user clicks "New", we change `activePage` to `CREATE`. The Layout renders the Create Page.
  - Azure Skin: When the user clicks "New", we keep `activePage` as `INDEX`, but set `activeModal` to `CREATE`. The Layout renders the Index Page, and pops open the Create Modal on top.

# CRUSH.md - Snau Frontend

## Build/Lint/Test Commands
- `pnpm install`: Install dependencies
- `pnpm run dev`: Start development server
- `pnpm run build`: Build for production
- `pnpm run lint`: Run ESLint
- `pnpm run typecheck`: Run TypeScript checks
- `pnpm run test`: Run tests (No single test command found)

## Code Style Guidelines
### Imports
- Group imports by source (Vue, composables, types, etc.)
- Use absolute paths for project imports

### Formatting
- Follow `.prettierrc` rules
- Use 2-space indentation
- Max line length: 80 chars

### Types
- Always define props with `defineProps<Type>()`
- Use TypeScript interfaces for props and composables

### Naming
- Components: `PascalCase` (e.g., `KirbyBlockScrollingStory`)
- Composable functions: `useCamelCase` (e.g., `useInterviewData`)

### Error Handling
- Use try/catch for async operations
- Log errors with context
- Validate API responses

## Conventions from Cursor Rules
- Use Nuxt UI components where possible
- Prefer `pnpm` over npm
- Structure components with:
  - Imports first
  - Props
  - Composables
  - Computed properties
  - Methods
  - Template

## Git Hygiene
- Added `.crush` to `.gitignore`
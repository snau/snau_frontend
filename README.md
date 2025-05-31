[![Cacao Kit Frontend](./.github/og-image.png)](https://cacao-kit.byjohann.dev)

# SNAU Frontend

A modern Nuxt 3 frontend application built for SNAU, featuring headless Kirby CMS integration with internationalization support.

## 🚀 Tech Stack

### Core Framework

- **[Nuxt 3](https://nuxt.com/)** (v3.17.4) - Vue.js framework with SSR/SSG
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** (v5.8.3) - Type-safe JavaScript

### Styling & UI

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Nuxt UI](https://ui.nuxt.com/)** (v3.1.3) - Vue component library
- **[GSAP](https://greensock.com/gsap/)** (v3.12.7) - Animation library

### CMS & Data

- **[Kirby CMS](https://getkirby.com/)** - Headless CMS backend
- **[nuxt-kql](https://nuxt-kql.byjohann.dev)** (v1.5.4) - Kirby Query Language integration
- **[Nuxt Image](https://image.nuxt.com/)** (v1.10.0) - Image optimization

### Internationalization

- **[@nuxtjs/i18n](https://i18n.nuxtjs.org/)** (v9.5.4) - Multi-language support
- **Languages**: English (default), German

### Development Tools

- **[ESLint](https://eslint.org/)** (v9.27.0) with [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- **[Prettier](https://prettier.io/)** (v3.5.3) - Code formatting
- **[pnpm](https://pnpm.io/)** (v10.11.0) - Package manager

### Additional Libraries

- **[VueUse](https://vueuse.org/)** (v13.3.0) - Vue composition utilities
- **[marked](https://marked.js.org/)** (v15.0.7) - Markdown parser
- **[medium-zoom](https://medium-zoom.francoischalifour.com/)** (v1.1.0) - Image zoom functionality

## 🏗️ Architecture

### Project Structure

```
snau_frontend/
├── app/
│   ├── assets/css/          # Global styles
│   ├── components/          # Vue components
│   │   ├── App/            # Application-level components
│   │   └── Kirby/          # CMS-specific components
│   │       ├── Block/      # Content block components
│   │       └── Layouts.vue # Layout renderer
│   ├── composables/        # Vue composables
│   ├── pages/              # Nuxt pages
│   ├── plugins/            # Nuxt plugins
│   ├── queries/            # KQL queries
│   └── utils/              # Utility functions
├── i18n/locales/           # Translation files
├── public/                 # Static assets
├── server/routes/          # Server API routes
└── shared/types/           # TypeScript definitions
```

### Key Design Patterns

- **Block-first Architecture**: Content is rendered through Kirby blocks
- **Catch-all Routing**: Single `[...slug].vue` handles all dynamic pages
- **Composable-driven Logic**: Reusable business logic in composables
- **Type-safe CMS Integration**: Strong TypeScript integration with Kirby

## 🚨 Critical Issues & Technical Debt

### ✅ Resolved Issues

#### 1. Performance Issues - FIXED ✅

- **Base64 Images**: `StoreLinks.vue` has been removed
  - **Status**: Component deleted, performance issue resolved
  - **Additional Fix**: Removed component references from `Blocks.vue` import mappings

#### 2. Repository Hygiene - FIXED ✅

- **`.DS_Store` Files**: All macOS system files removed
  - **Status**: Files deleted, `.gitignore` properly configured

#### 3. Code Quality - FIXED ✅

- **ESLint Errors**: Import sorting violations resolved
  - **Status**: All linting and formatting issues fixed

### High Priority

#### 4. Component Complexity

- **ScrollingStory.vue**: 580 lines - monolithic component
- **InterviewsGrid.vue**: 328 lines
- **Layouts.vue**: 325 lines
- **Solution**: Break into smaller, focused components

#### 5. Composable Complexity

- **useInterviewFilters.ts**: 141 lines
- **page.ts**: 130 lines
- **Solution**: Split into single-purpose composables

### Medium Priority

- Inconsistent error handling patterns
- Limited type definitions for CMS data
- No testing infrastructure
- Missing bundle optimization
- Insufficient documentation

## 🛠️ Development Setup

### Prerequisites

1. **Node.js** (v18+)
2. **pnpm** (v10.11.0) - Enable with `corepack enable`
3. **Kirby Backend** - Running instance required

### Environment Variables

Create `.env` file:

```bash
# Kirby CMS Backend
KIRBY_BASE_URL=https://your-kirby-backend.com
KIRBY_API_TOKEN=your-bearer-token

# Optional
NUXT_PUBLIC_SITE_URL=https://your-frontend.com
```

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Development with tunnel (for Kirby proxy)
pnpm dev:tunnel
```

### Available Scripts

```bash
# Development
pnpm dev                 # Start dev server
pnpm dev:tunnel         # Start with tunnel for Kirby proxy

# Building
pnpm build              # Build for production
pnpm generate           # Static site generation
pnpm preview            # Preview production build

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint issues
pnpm format             # Format with Prettier
pnpm format:check       # Check formatting
pnpm test:types         # TypeScript type checking
pnpm check:all          # Run all checks

# Preparation
pnpm prepare            # Nuxt preparation
```

## 🏗️ Development Guidelines

### Component Development

1. **Block Components**: Place in `app/components/Kirby/Block/`
2. **Register in Blocks.vue**: Add to component mapping
3. **Follow Naming**: Use PascalCase, descriptive names
4. **Keep Small**: Aim for <200 lines per component

### Adding New Blocks

```typescript
// In components/Kirby/Blocks.vue
import { LazyKirbyBlockYourBlock } from '#components'

const blockComponents: Partial<Record<string, Component>> = {
  'your-block': LazyKirbyBlockYourBlock,
}
```

### Composables Best Practices

1. **Single Responsibility**: One concern per composable
2. **Reactive Data**: Use `ref`/`reactive` appropriately
3. **Error Handling**: Consistent error patterns
4. **TypeScript**: Full type coverage

### Styling Guidelines

1. **Tailwind First**: Use utility classes
2. **Component Scoped**: Avoid global styles
3. **Responsive**: Mobile-first approach
4. **Dark Mode**: Consider dark mode support

## 🚀 Deployment

### Static Generation

```bash
pnpm generate
```

### Server-Side Rendering

```bash
pnpm build
pnpm preview
```

### Netlify (Current Setup)

- **Build Command**: `pnpm run generate`
- **Output Directory**: `.output/public`
- **Node Version**: 22
- **Deployment Type**: Static Site Generation (SSG)

#### Netlify Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "pnpm run generate"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "22"
  NPM_FLAGS = "--version"
  PNPM_VERSION = "10.11.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Cloudflare Pages (Alternative)

- **Build Command**: `pnpm build`
- **Output Directory**: `.output/public`
- **Node Version**: 18+

### Environment Variables (Production)

```bash
KIRBY_BASE_URL=https://backend.snau.net
KIRBY_API_TOKEN=your-api-token-here
NUXT_PUBLIC_SITE_URL=https://snau.net
```

#### Setting Environment Variables in Netlify

1. Go to **Site settings** → **Environment variables**
2. Add the variables above
3. Redeploy the site

## 🔧 Configuration

### Nuxt Configuration

- **SSR**: Enabled by default
- **Static Generation**: Configured for `/` route
- **i18n**: English/German support
- **Image Optimization**: Enabled
- **Dev Proxy**: Kirby backend proxy for development

### ESLint Configuration

- **Base**: @antfu/eslint-config
- **Disabled Rules**: Vue formatting rules (conflicts with Prettier)
- **TypeScript**: Full support

### Tailwind Configuration

- **Custom Config**: `tailwind.config.ts`
- **Nuxt UI**: Integrated component system

## 🧪 Testing (TODO)

Currently no testing infrastructure. Recommended additions:

- **Vitest**: Unit testing
- **@vue/test-utils**: Component testing
- **Playwright**: E2E testing

## 📊 Performance Optimization

### Current Issues

1. Large base64 images in components
2. No bundle analysis
3. Missing code splitting optimization

### Recommended Improvements

1. **Image Optimization**: Use Nuxt Image module
2. **Bundle Analysis**: Add webpack-bundle-analyzer
3. **Code Splitting**: Implement dynamic imports
4. **Caching**: Configure proper cache headers

## 🔒 Security

### Current Status

- **CSP**: Not configured
- **Security Headers**: Missing
- **Environment Variables**: Properly handled

### Recommended Additions

1. Content Security Policy
2. Security headers middleware
3. Input validation
4. Rate limiting

## 📚 Resources

### Documentation

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Kirby CMS Documentation](https://getkirby.com/docs)
- [nuxt-kql Documentation](https://nuxt-kql.byjohann.dev)
- [Nuxt UI Documentation](https://ui.nuxt.com)

### Community

- [Kirby Discord](https://chat.getkirby.com)
- [Nuxt Discord](https://discord.com/invite/ps2h6QT)

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details.

---

## 🚧 Remaining Action Items

### ✅ Completed

1. ~~**Fix base64 images** in `StoreLinks.vue`~~ - DONE
   - ~~Component deleted~~
   - ~~Import references removed from `Blocks.vue`~~
2. ~~**Remove `.DS_Store` files** from repository~~ - DONE
3. ~~**Fix ESLint errors** with `pnpm lint --fix`~~ - DONE
4. ~~**Fix development server errors**~~ - DONE

### 🔄 Next Priority

5. **Refactor large components** (ScrollingStory, InterviewsGrid)
6. **Add testing infrastructure**
7. **Implement bundle optimization**
8. **Add security headers** (partially done via netlify.toml)
9. **Expand type definitions**

[![Cacao Kit Frontend](./.github/og-image.png)](https://cacao-kit.byjohann.dev)

# SNAU Frontend

A modern Nuxt 3 frontend application built for SNAU, featuring headless Kirby CMS integration with internationalization support.

## 🚀 Tech Stack

### Core Framework

- **[Nuxt 3](https://nuxt.com/)** (v3.17.6) - Vue.js framework with SSR/SSG
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** (v5.8.3) - Type-safe JavaScript

### Styling & UI

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Nuxt UI](https://ui.nuxt.com/)** (v3.2.0) - Vue component library
- **[GSAP](https://greensock.com/gsap/)** (v3.13.0) - Animation library

### CMS & Data

- **[Kirby CMS](https://getkirby.com/)** - Headless CMS backend
- **[nuxt-kql](https://nuxt-kql.byjohann.dev)** (v1.5.6) - Kirby Query Language integration
- **[Nuxt Image](https://image.nuxt.com/)** (v1.10.0) - Image optimization

### Internationalization

- **[@nuxtjs/i18n](https://i18n.nuxtjs.org/)** (v9.5.6) - Multi-language support
- **Languages**: English (default), German

### Development Tools

- **[ESLint](https://eslint.org/)** (v9.30.1) with [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- **[Prettier](https://prettier.io/)** (v3.6.2) - Code formatting
- **[pnpm](https://pnpm.io/)** (v10.13.1) - Package manager

### Additional Libraries

- **[VueUse](https://vueuse.org/)** (v13.5.0) - Vue composition utilities
- **[marked](https://marked.js.org/)** (v16.0.0) - Markdown parser
- **[medium-zoom](https://medium-zoom.francoischalifour.com/)** (v1.1.0) - Image zoom functionality
- **[PhotoSwipe](https://photoswipe.com/)** (v5.4.4) - Responsive image gallery with lightbox
- **[DOMPurify](https://github.com/cure53/DOMPurify)** (v3.2.6) - HTML sanitization library
- **[@nuxtjs/mdc](https://mdc.nuxtjs.org/)** (v0.17.0) - Markdown component rendering

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

#### 4. HTML Entity Rendering - ACKNOWLEDGED ✅

- **Bold Text Rendering**: HTML entities (`&lt;strong&gt;`) from Kirby CMS
  - **Status**: Using plain `v-html` rendering; content displayed as-is from CMS
  - **Note**: HTML formatting within text content is managed at the CMS level

### High Priority

#### 5. Component Complexity - PARTIALLY ADDRESSED ✅

- **ScrollingStory.vue**: ~~580 lines~~ → **265 lines** (54% reduction) - REFACTORED ✅
  - **Status**: Successfully extracted block components and composables
  - **Architecture**: Now uses modular block renderer and dedicated composables
- **InterviewsGrid.vue**: ~~328 lines~~ → **Replaced with Portfolio component** - REFACTORED ✅
  - **Status**: Component replaced with more flexible Portfolio block
- **Layouts.vue**: 325 lines - PENDING
  - **Status**: Scheduled for refactoring in next sprint
  - **Plan**: Extract layout-specific components and composables
  - **Target**: Reduce to <200 lines with improved maintainability

#### 6. Composable Complexity

- **useInterviewFilters.ts**: 141 lines
  - **Status**: Scheduled for refactoring
  - **Plan**: Split into filter-specific composables (useFilterState, useFilterActions)
- **page.ts**: 130 lines
  - **Status**: Scheduled for refactoring
  - **Plan**: Extract SEO, i18n, and page state management into separate composables

## 🆕 Recent Enhancements (July 2025)

### New Features & Components

#### 1. PhotoSwipe Integration ✅

- **PhotoSwipe Gallery**: Added responsive image gallery with lightbox functionality to `Gallery.vue` block component
- **Components**: Enhanced `Gallery.vue` with PhotoSwipe Lightbox integration for grid-based image galleries
- **Features**: Zoom animations, keyboard navigation, touch gestures, and responsive image loading
- **User Experience**: Hover effects with zoom icons, smooth transitions, and proper focus point handling
- **Styling**: Integrated PhotoSwipe CSS with custom styling for optimal gallery display
- **July 2025 Update**: Simplified Gallery component implementation with improved reliability and performance

#### 2. Enhanced Block Components ✅

- **Buttons Block**: New flexible button component with multiple variants (primary, secondary, tertiary, quaternary, white)
- **ContentTeaser Block**: Replaced TeamStructure with more flexible content teaser component
- **Spacing Block**: Added configurable spacing component with responsive sizing options
- **Portfolio Block**: Replaced InterviewsGrid with more versatile Portfolio component

#### 3. Improved Typography & Styling ✅

- **Font Updates**: Integrated Fira Sans and EB Garamond fonts via Bunny Fonts
- **Enhanced Styling**: Updated blockquote, figcaption, and button styles
- **Color System**: Migrated from stone to neutral color variables for better consistency
- **Animation**: Added fade-in animations for block rendering and page transitions

#### 4. Enhanced Markdown Support ✅

- **MDC Integration**: Added @nuxtjs/mdc for enhanced markdown component rendering
- **Improved Parser**: Updated markdown parsing with better caching and performance
- **Security**: Integrated DOMPurify for HTML sanitization

#### 5. UI/UX Improvements ✅

- **Page Transitions**: Implemented fade transitions for smoother navigation
- **Header Enhancements**: Added frosted glass background effect and improved scroll behavior
- **Footer Updates**: Enhanced navigation structure with dynamic legal links
- **Responsive Design**: Improved mobile responsiveness across components

### Medium Priority

- **Inconsistent error handling patterns**
  - **Plan**: Implement standardized error handling with composables
  - **Target**: Q3 2025
- **Limited type definitions for CMS data**
  - **Plan**: Expand TypeScript interfaces for Kirby blocks and content
  - **Target**: Ongoing, prioritizing most-used components
- **No testing infrastructure**
  - **Plan**: Implement Vitest for unit testing and component testing
  - **Target**: Q4 2025
- **Missing bundle optimization**
  - **Plan**: Add webpack-bundle-analyzer and implement code splitting
  - **Target**: Q3 2025
- **Insufficient documentation**
  - **Plan**: Create comprehensive component and API documentation
  - **Target**: Ongoing

## 🛠️ Development Setup

### Prerequisites

1. **Node.js** (v18+)
2. **pnpm** (v10.13.1) - Enable with `corepack enable`
3. **Kirby Backend** - Running instance required

### Environment Variables

Create `.env` file:

```bash
# Kirby CMS Backend
KIRBY_BASE_URL=https://your-kirby-backend.com
KIRBY_API_TOKEN=your-bearer-token

# Optional - Used for generating absolute URLs (e.g., for SEO, sitemaps)
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

## 🌐 Deployment

This project uses **Static Site Generation (SSG)** for optimal performance and is deployed via **Netlify**.

### Build for Production

```bash
# Generate static site
pnpm generate

# Preview the generated site locally
pnpm preview
```

### Netlify (Primary Deployment)

The project is configured for static site generation and deployed via Netlify:

- **Build Command**: `pnpm run generate`
- **Output Directory**: `.output/public`
- **Node Version**: 22
- **Deployment Type**: Static Site Generation (SSG)

#### Netlify Configuration

The `netlify.toml` file is already configured with:

```toml
[build]
  command = "pnpm run generate"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "22"
  NPM_FLAGS = "--version"
  PNPM_VERSION = "10.13.1"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

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

const blockComponents: Record<string, Component> = {
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

## 🔧 Configuration

### Nuxt Configuration

- **SSG**: Static Site Generation enabled
- **Prerendering**: Configured for optimal static output
- **i18n**: English/German support with @nuxtjs/i18n
- **Image Optimization**: Enabled with @nuxt/image
- **MDC**: Markdown component rendering with @nuxtjs/mdc
- **Page Transitions**: Fade transitions for smooth navigation
- **Dev Proxy**: Kirby backend proxy for development

### ESLint Configuration

- **Base**: @antfu/eslint-config
- **Disabled Rules**: Vue formatting rules (conflicts with Prettier)
- **TypeScript**: Full support

### Tailwind Configuration

- **Custom Config**: `tailwind.config.ts`
- **Nuxt UI**: Integrated component system

## 📊 Performance Optimization

### Recent Improvements ✅

1. ~~Large base64 images in components~~ - RESOLVED ✅
2. **Component Refactoring**: Reduced ScrollingStory from 580 to 265 lines (54% reduction)
3. **Lazy Loading**: All block components use lazy loading with `Lazy` prefix
4. **Animation Optimization**: Added fade-in animations with FadeIn component
5. **Markdown Caching**: Implemented caching in markdown parser for better performance
6. **PhotoSwipe Integration**: Efficient image gallery with lazy loading and optimized structure

### Current Issues

1. No bundle analysis
2. Missing code splitting optimization
3. Limited performance monitoring

### Recommended Improvements

1. **Bundle Analysis**: Add webpack-bundle-analyzer
2. **Code Splitting**: Implement dynamic imports for large components
3. **Caching**: Configure proper cache headers
4. **Performance Monitoring**: Add performance metrics tracking

## 🔒 Security

### Recent Improvements ✅

- **HTML Sanitization**: Integrated DOMPurify (v3.2.6) for safe HTML rendering
- **Environment Variables**: Properly handled and secured
- **Type Safety**: Enhanced TypeScript integration for better security

### Current Status

- **CSP**: Not configured
- **Security Headers**: Missing
- **Input Validation**: Basic validation in place

### Recommended Additions

1. Content Security Policy
2. Security headers middleware
3. Enhanced input validation
4. Rate limiting

## 🧪 Testing (Planned)

Currently no testing infrastructure. Implementation planned for Q4 2025:

- **Vitest**: Unit testing for utility functions and composables
- **@vue/test-utils**: Component testing for UI components
- **Playwright**: E2E testing for critical user flows

### Testing Strategy

1. **Phase 1**: Set up testing infrastructure and write tests for critical utilities
2. **Phase 2**: Add component tests for core block components
3. **Phase 3**: Implement E2E tests for main user journeys

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
5. ~~**Refactor ScrollingStory.vue component**~~ - DONE
   - ~~Reduced from 580 to 265 lines (54% reduction)~~
   - ~~Extracted 6 block components and 3 composables~~
   - ~~Improved maintainability and modularity~~
6. ~~**Add PhotoSwipe image gallery functionality**~~ - DONE
   - ~~Integrated PhotoSwipe v5.4.4 for responsive image galleries~~
   - ~~Enhanced Gallery.vue block component with PhotoSwipe Lightbox integration~~
   - ~~Added zoom animations, keyboard navigation, and touch gesture support~~
   - ~~Implemented hover effects with zoom icons and smooth transitions~~
   - ~~Maintained existing focus point functionality for proper image cropping~~
   - ~~July 2025 Update: Optimized Gallery component with simplified structure for better reliability~~
7. ~~**Enhance block component system**~~ - DONE
   - ~~Added Buttons, ContentTeaser, Spacing, and Portfolio blocks~~
   - ~~Replaced TeamStructure and InterviewsGrid with improved components~~
   - ~~Improved component flexibility and reusability~~
8. ~~**Improve typography and styling system**~~ - DONE
   - ~~Integrated Fira Sans and EB Garamond fonts~~
   - ~~Enhanced color system with neutral variables~~
   - ~~Added fade animations and page transitions~~
9. ~~**Enhance markdown support and security**~~ - DONE
   - ~~Integrated @nuxtjs/mdc for better markdown rendering~~
   - ~~Added DOMPurify for HTML sanitization~~
   - ~~Improved markdown parsing performance~~

### 🔄 Next Priority (Q3-Q4 2025)

1. **Refactor remaining large components** (Layouts.vue)
   - ~~ScrollingStory.vue~~ - COMPLETED ✅
   - ~~InterviewsGrid.vue~~ - COMPLETED ✅ (replaced with Portfolio)
   - **Layouts.vue**: 325 lines - PENDING
2. **Add testing infrastructure**
   - Set up Vitest for unit testing
   - Configure component testing with @vue/test-utils
   - Add E2E testing with Playwright for critical flows
3. **Implement bundle optimization**
   - Add webpack-bundle-analyzer
   - Implement code splitting for large components
   - Optimize asset loading
4. **Add security headers**
   - Configure Content Security Policy
   - Implement security headers middleware
   - Enhance input validation
5. **Expand type definitions**
   - Create comprehensive TypeScript interfaces for CMS data
   - Improve type safety across the application
   - Document type system

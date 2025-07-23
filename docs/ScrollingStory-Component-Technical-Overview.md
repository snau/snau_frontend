# ScrollingStory Component - Technical Overview

## Component Overview

### Purpose and Role within the System

The `ScrollingStory` component is a dynamic storytelling Vue component that creates an immersive scrolling experience with synchronized content and images. It's designed to present narrative content in an engaging way where text and visuals are coordinated through scroll interactions.

The component is part of a Kirby CMS integration within a Nuxt.js application, specifically designed to render content blocks of type `scrolling-story` from Kirby's structured content system.

### High-level Functionality and Intended Use Cases

1. **Dual-panel Layout**: Implements a responsive layout with a fixed left panel for images (desktop) and scrollable right panel for content
2. **Scroll-synchronized Transitions**: Uses Intersection Observer API to detect when content sections enter the viewport and synchronize image changes
3. **Responsive Design**: Adapts layout for mobile and desktop with different presentation modes
4. **Markdown Content Rendering**: Processes and renders markdown content with caching for performance
5. **Dynamic Styling**: Supports per-section background colors, gradients, and text colors

### Relationships with Other Components or Modules

- **Parent Components**: Any component that renders Kirby content blocks
- **Child Components**:
  - `BlockRenderer` - Renders nested content blocks within sections
- **Composables**:
  - `useScrollingStoryObserver` - Manages scroll observation and image synchronization
  - `useScrollingStoryBackground` - Handles dynamic background styling
  - `useMarkdownParser` - Processes markdown content
- **Dependencies**:
  - Kirby CMS through `#nuxt-kql` module
  - Vue 3 Composition API

## Architecture & Structure

### File Structure

```
app/components/Kirby/Block/
├── ScrollingStory.vue                    # Main component
├── ScrollingStory/
│   ├── BlockRenderer.vue                 # Nested block renderer
│   └── composables/
│       ├── useScrollingStoryObserver.ts  # Scroll observation logic
│       └── useScrollingStoryBackground.ts # Background styling logic
```

### Key Classes, Functions, or Modules

1. **Main Component (`ScrollingStory.vue`)**:
   - Implements the dual-panel layout
   - Manages responsive rendering for mobile/desktop
   - Coordinates data flow between composables

2. **Composables**:
   - `useScrollingStoryObserver`: Core scroll interaction logic
   - `useScrollingStoryBackground`: Dynamic styling management
   - `useMarkdownParser`: Content processing utility

3. **BlockRenderer Component**:
   - Handles rendering of nested content blocks
   - Provides consistent interface for different block types

### Internal Data Flow and Control Logic

1. **Initialization**:
   - Component receives `block` prop with `leftcontent` and `rightcontent` arrays
   - Composables initialize with content data

2. **Scroll Observation**:
   - `useScrollingStoryObserver` creates IntersectionObserver instances
   - Observers track visibility of content markers
   - Active section index and image ID are updated based on visibility

3. **Rendering**:
   - Left panel displays images based on `currentImageId`
   - Right panel renders content sections with dynamic styling
   - First section has special mobile layout with full-screen image

4. **Styling**:
   - `useScrollingStoryBackground` computes background styles
   - Text color is dynamically determined per section

## Interfaces & APIs

### Public Props

```typescript
interface BlockProps {
  block: KirbyBlock<
    'scrolling-story',
    {
      leftcontent: LeftContent[]
      rightcontent: RightContent[]
    }
  >
}
```

### Data Structures

```typescript
interface LeftContent {
  coverimage: ResolvedKirbyImage | null
  id: string
}

interface RightContent {
  markerReference: string
  text: string
  backgroundcolor: string
  secondarybackgroundcolor: string
  textcolor: string
  blocks: any[] | any
}
```

### Composable APIs

1. **useScrollingStoryObserver**:

   ```typescript
   const { currentMarkerIndex, currentImageId } = useScrollingStoryObserver(
     leftcontent: LeftContent[],
     rightcontent: RightContent[]
   )
   ```

2. **useScrollingStoryBackground**:

   ```typescript
   const { backgroundStyle } = useScrollingStoryBackground(
     currentMarkerIndex: Ref<number>,
     rightcontent: RightContent[]
   )
   ```

3. **useMarkdownParser**:
   ```typescript
   const { parseMarkdown } = useMarkdownParser()
   ```

## Dependencies

### External Libraries and Frameworks

- **Vue 3**: Composition API with `<script setup>` syntax
- **TypeScript**: For type safety
- **Intersection Observer API**: Native browser API for scroll detection
- **Kirby CMS**: Content management system (through Nuxt KQL module)

### Internal Modules

- `#nuxt-kql`: Kirby Query Language integration for Nuxt
- `../../../../shared/types/kirby`: Custom type definitions for Kirby content
- `./ScrollingStory/BlockRenderer.vue`: Nested block rendering component
- `./ScrollingStory/composables/useScrollingStoryObserver.ts`: Scroll observation logic
- `./ScrollingStory/composables/useScrollingStoryBackground.ts`: Background styling logic
- `../../composables/useMarkdownParser.ts`: Markdown processing utility

## State Management

### State Handling Approach

The component uses a distributed state management approach:

- **Local Reactive State**: Vue refs and computed properties for UI state
- **Composable-Encapsulated State**: Each composable manages its specific domain state
- **Prop-Driven Data**: Content data flows through component props

### Key State Variables

1. **From `useScrollingStoryObserver`**:
   - `currentMarkerIndex`: Index of currently active content section
   - `currentImageId`: ID of currently visible image

2. **From Component**:
   - `currentTextColor`: Computed text color based on active section

### Lifecycle Events and State Transitions

1. **Component Mount**:
   - Intersection observers are initialized
   - Initial state is set based on first visible section

2. **Scroll Events**:
   - Observers detect section visibility changes
   - State variables update to reflect active section
   - UI re-renders with new image/content/styling

3. **Component Unmount**:
   - Observers are disconnected
   - Cleanup of event listeners

## Configuration & Environment

### Configuration Files

The component relies on Kirby CMS configuration through the Nuxt KQL module, but doesn't have specific configuration files of its own.

### Customizable Settings

1. **Content-Driven Customization**:
   - Background colors per section
   - Text colors per section
   - Image selection and ordering
   - Markdown content formatting

2. **Styling Constants**:
   - Transition durations (hardcoded in template)
   - Breakpoints (Tailwind classes)
   - Height calculations (hardcoded values)

## Error Handling & Edge Cases

### Current Error Handling

1. **Image Loading**:
   - Uses native `loading="lazy"` attribute
   - No explicit error handling for failed image loads

2. **Content Rendering**:
   - Conditional rendering with `v-if` guards
   - Default values for missing data (`|| 'inherit'`)

3. **State Management**:
   - Bounds checking for array indices
   - Null checking for optional properties

### Known Limitations and Edge Cases

1. **Empty Content Handling**:
   - No explicit handling for empty `leftcontent` or `rightcontent` arrays
   - May result in empty panels without clear user feedback

2. **Image Loading Failures**:
   - No fallback mechanisms for failed image loads
   - Could result in missing visual content

3. **Performance with Large Content Sets**:
   - All images are pre-rendered in the DOM
   - Could impact performance with many sections

4. **Accessibility**:
   - Limited ARIA attributes for dynamic content changes
   - No keyboard navigation support for image transitions

## Performance & Scalability Considerations

### Potential Bottlenecks

1. **Image Rendering**:
   - All images are rendered in the DOM simultaneously
   - Only visibility is controlled through opacity
   - Memory usage scales linearly with number of images

2. **Markdown Parsing**:
   - Uses caching mechanism to prevent re-parsing
   - Initial parse of large markdown blocks could be slow

3. **Observer Management**:
   - One observer per content section
   - Could become resource-intensive with many sections

### Async Operations

1. **Image Loading**:
   - Native lazy loading with `loading="lazy"`
   - No explicit async handling in component code

2. **Markdown Processing**:
   - Synchronous operation with internal caching
   - No async boundaries in current implementation

### Resource Usage

1. **DOM Elements**:
   - Multiple image elements always present in DOM
   - Content markers for each section
   - Nested block renderers for complex content

2. **Memory**:
   - Image data retained in memory even when not visible
   - Observer instances for each section

## Testing

### Current Test Coverage

No specific unit, integration, or end-to-end tests were found for the ScrollingStory component or its related files.

### Notable Missing Test Cases

1. **Scroll Interaction Testing**:
   - Intersection observer behavior
   - State transitions during scrolling

2. **Responsive Layout Testing**:
   - Mobile vs desktop rendering
   - Breakpoint behavior

3. **Content Rendering**:
   - Markdown parsing and rendering
   - BlockRenderer functionality
   - Empty content handling

4. **Edge Cases**:
   - Missing image data
   - Invalid color values
   - Large content sets

## Suggested Improvements for Restructuring

### Modularization and Readability

1. **Component Splitting**:
   - Separate LeftPanel and RightPanel components
   - Extract FirstSection and RegularSection components
   - Create dedicated Mobile and Desktop layout components

2. **Composable Refactoring**:
   - Split large composables into more focused units
   - Create a useImageLoading composable for error handling
   - Extract useResponsiveLayout for breakpoint management

### Performance Improvements

1. **Image Optimization**:
   - Implement virtual scrolling for images
   - Add error boundaries for failed image loads
   - Use `v-show` instead of `v-for` with `v-show` for better performance

2. **Memory Management**:
   - Dynamically add/remove observer instances
   - Implement image unloading when not in viewport

3. **Rendering Optimization**:
   - Add `v-memo` for static content sections
   - Implement virtual scrolling for large content sets

### Better Separation of Concerns

1. **Styling Logic**:
   - Move complex style calculations to composables
   - Create a useStyling composable for color management
   - Extract gradient calculations to utility functions

2. **Content Processing**:
   - Create a useContentProcessor composable
   - Separate markdown parsing from rendering concerns

### Design Pattern Adherence

1. **Observer Pattern**:
   - Formalize the observer management pattern
   - Create a useIntersectionObserver factory pattern

2. **State Management**:
   - Consider using a more formal state management solution for complex scroll interactions
   - Implement a finite state machine for section transitions

### Reusability and Extensibility

1. **Configuration API**:
   - Add more customization options through props
   - Support for custom transition effects
   - Plugin system for additional content block types

2. **Accessibility**:
   - Add proper ARIA attributes for dynamic content
   - Implement keyboard navigation support
   - Add screen reader announcements for section changes

3. **Internationalization**:
   - Add support for RTL layouts
   - Extract hardcoded strings to i18n system

### Specific Implementation Suggestions

1. **Image Handling**:

   ```typescript
   // Instead of rendering all images and toggling opacity
   const visibleImage = computed(() => {
     return props.block.content.leftcontent.find(
       (item) => item.id === currentImageId.value,
     )
   })
   ```

2. **Content Normalization**:

   ```typescript
   // Move normalizeBlocks to a utility function
   // Consider creating a content processing pipeline
   const processedContent = useContentProcessor(
     props.block.content.rightcontent,
   )
   ```

3. **Error Boundaries**:

   ```vue
   <ErrorBoundary>
     <img :src="item.coverimage?.url" @error="handleImageError" />
   </ErrorBoundary>
   ```

4. **Performance Monitoring**:
   ```typescript
   // Add performance metrics tracking
   const { trackScrollPerformance } = usePerformanceMonitoring()
   ```

These improvements would make the component more maintainable, performant, and reusable while addressing current limitations in error handling, testing, and scalability.

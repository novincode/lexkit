# LexKit Monorepo Architecture

## Overview

LexKit is a modern monorepo built with pnpm workspaces and Turbo, containing a headless, type-safe rich text editor library built on Meta's Lexical, along with its documentation website, shared UI components, and development tooling.

## Monorepo Structure

```
lexkit/
├── apps/
│   └── web/                 # Next.js documentation and demo site
├── packages/
│   ├── editor/              # Core @lexkit/editor package
│   ├── ui/                  # Shared UI components (@repo/ui)
│   ├── meta/                # Convenience re-export package
│   ├── eslint-config/       # Shared ESLint configurations
│   └── typescript-config/   # Shared TypeScript configurations
├── package.json             # Root package with workspace scripts
├── pnpm-workspace.yaml      # Workspace configuration
├── turbo.json               # Build orchestration config
└── tsconfig.json            # Root TypeScript config
```

## Technology Stack

- **Package Manager**: pnpm with workspaces
- **Build Orchestration**: Turbo
- **Language**: TypeScript
- **Framework**: React 19, Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Editor Foundation**: Lexical
- **Deployment**: Cloudflare Pages

## Apps

### Web App (`apps/web`)

The main Next.js application serving as the project's website:

- **Framework**: Next.js 15 with App Router
- **Features**:
  - Interactive documentation
  - Live demo playground
  - Code examples and templates
  - API reference
- **Deployment**: Cloudflare Pages with `next-on-pages`
- **Key Dependencies**:
  - Lexical packages for editor functionality
  - @lexkit/editor for demos
  - @repo/ui for consistent UI
  - Zustand for state management
  - Shiki for code highlighting

**Build Process**:
- Generates code registry for documentation
- Builds with Next.js
- Deploys via Cloudflare Pages

## Packages

### Editor Package (`packages/editor`)

The core library providing the type-safe rich text editor:

- **Package**: `@lexkit/editor`
- **Architecture**: Extension-based, headless design
- **Key Features**:
  - Type-safe command and state APIs
  - Modular extensions system
  - Built-in extensions (25+): formatting, lists, images, tables, etc.
  - Export capabilities (HTML, Markdown, JSON)
- **Build Tool**: tsup for ESM/CommonJS bundles
- **Dependencies**: None (peer dependencies on Lexical packages)

**Extension System**:
- BaseExtension abstract class
- Specialized extensions (TextFormatExtension, etc.)
- Commands, state queries, and plugins
- Type inference from extension array

### UI Package (`packages/ui`)

Shared component library based on shadcn/ui:

- **Package**: `@repo/ui`
- **Components**: 30+ components (buttons, dialogs, forms, etc.)
- **Styling**: Tailwind CSS with CSS variables
- **Features**:
  - Dark mode support
  - Accessible components
  - Form integration with react-hook-form
- **Dependencies**: Radix UI primitives, Tailwind utilities

### Meta Package (`packages/meta`)

Convenience package for easy installation:

- **Package**: `lexkit`
- **Purpose**: Re-exports all functionality from `@lexkit/editor`
- **Use Case**: Single import for getting started

### Configuration Packages

#### ESLint Config (`packages/eslint-config`)

Shared linting configurations:

- `base.js`: General JavaScript/TypeScript rules
- `next.js`: Next.js specific rules
- `react-internal.js`: Internal React component rules

#### TypeScript Config (`packages/typescript-config`)

Shared TypeScript configurations:

- `base.json`: Base TypeScript settings
- `nextjs.json`: Next.js project settings
- `react-library.json`: React library settings

## Build System

### Turbo Configuration

Turbo orchestrates builds and development tasks:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": { "dependsOn": ["^lint"] },
    "dev": { "cache": false, "persistent": true },
    "check-types": { "dependsOn": ["^check-types"] }
  }
}
```

- **Caching**: Intelligent caching of build outputs
- **Dependencies**: Task dependencies between packages
- **Parallelization**: Concurrent task execution

### Development Scripts

Root-level scripts in `package.json`:

- `build`: Full monorepo build
- `dev`: Start development servers
- `lint`: Lint all packages
- `format`: Format code with Prettier

## Development Workflow

### Local Development

1. **Setup**: `pnpm install`
2. **Development**: `pnpm dev` (starts web app with hot reload)
3. **Building**: `pnpm build` (builds all packages and apps)
4. **Linting**: `pnpm lint` (ESLint across workspace)
5. **Type Checking**: Individual packages have `typecheck` scripts

### Code Generation

The web app includes scripts for generating documentation content:

- `generate-registry.ts`: Creates code registry for examples
- `generate-codes-loader.ts`: Generates code loaders

### Publishing

- **Editor Package**: Published to npm as `@lexkit/editor`
- **Meta Package**: Published to npm as `lexkit`
- **Internal Packages**: Not published (workspace-only)

## Deployment

### Web App

- **Platform**: Cloudflare Pages
- **Build Command**: `pnpm pages:build` (uses `next-on-pages`)
- **Deploy Command**: `pnpm deploy` (builds and deploys)

### Packages

- **Registry**: npm
- **Automation**: Manual publishing with version bumps
- **CDN**: Packages distributed via npm's CDN

## Architecture Principles

### Type Safety

- Strict TypeScript configuration
- Type inference from extension arrays
- Generic constraints for extension system

### Modularity

- Clear separation of concerns
- Workspace packages for shared code
- Extension-based architecture for editor

### Performance

- Turbo caching for fast rebuilds
- Tree-shaking friendly packages
- Lazy loading in Next.js app

### Developer Experience

- Hot reload during development
- Comprehensive documentation
- Interactive playground
- Shared tooling and configs

## Future Enhancements

- Automated publishing pipeline
- E2E testing setup
- Performance monitoring
- Internationalization support
- Plugin ecosystem</content>
<parameter name="filePath">/Users/shayanmoradi/Desktop/Work/lexkit/architecture.md
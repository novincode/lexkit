import { RegisteredCodeSnippet } from '@/app/(docs)/lib/types'

const CONTRIBUTING_CODES: RegisteredCodeSnippet[] = [
  {
    id: 'contributing-clone-repo',
    language: 'bash',
    code: `git clone https://github.com/novincode/lexkit.git
cd lexkit`
  },
  {
    id: 'contributing-install-deps',
    language: 'bash',
    code: `pnpm install`
  },
  {
    id: 'contributing-dev-server',
    language: 'bash',
    code: `pnpm run dev`
  },
  {
    id: 'contributing-project-structure',
    language: 'text',
    code: `lexkit/
├── apps/
│   └── web/                 # Main web application
│       ├── app/             # Next.js app directory
│       ├── components/      # Shared components
│       └── lib/             # Utility functions
├── packages/
│   ├── editor/              # Core editor package
│   ├── ui/                  # UI component library
│   ├── meta/                # Metadata utilities
│   ├── eslint-config/       # ESLint configurations
│   └── typescript-config/   # TypeScript configurations
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.json`
  },
  {
    id: 'contributing-create-branch',
    language: 'bash',
    code: `git checkout -b feature/your-feature-name`
  },
  {
    id: 'contributing-run-checks',
    language: 'bash',
    code: `pnpm run lint
pnpm run type-check
pnpm run test`
  }
]

export default CONTRIBUTING_CODES

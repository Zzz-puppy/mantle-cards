# Contributing to MantleCards

Thank you for your interest in contributing to MantleCards! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Branch Strategy](#branch-strategy)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## 📜 Code of Conduct

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone, regardless of level of experience, gender, gender identity and expression, age, sexual orientation, disability, personal appearance, race, ethnicity, religion, or nationality.

### Our Standards

**Encouraged:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Discouraged:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- MetaMask or WalletConnect wallet
- Basic understanding of React, Next.js, and TypeScript
- Familiarity with Web3 concepts (helpful but not required)

### Initial Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/mantle-cards.git
cd mantle-cards

# 3. Add upstream remote
git remote add upstream https://github.com/original-org/mantle-cards.git

# 4. Install dependencies
npm install

# 5. Copy environment file
cp .env.example .env.local

# 6. Start development server
npm run dev
```

## 💻 Development Setup

### Environment Variables

Create a `.env.local` file with required variables:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

## 🎨 Coding Standards

### TypeScript

- Use strict TypeScript mode
- Avoid `any` type - use proper typing
- Use interfaces for object shapes
- Use type aliases for unions and intersections

**Good:**
```typescript
interface Card {
  id: bigint;
  name: string;
  rarity: CardRarity;
  attack: number;
  defense: number;
}
```

**Avoid:**
```typescript
const card: any = { ... };
```

### React Components

- Use functional components with hooks
- Co-locate component files in feature directories
- Export connected components from `index.ts` files
- Use proper TypeScript props interfaces

**Component Structure:**
```typescript
interface ComponentProps {
  title: string;
  onAction: () => void;
}

export function Component({ title, onAction }: ComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CardDetail.tsx` |
| Hooks | camelCase with `use` prefix | `useBattle.ts` |
| Utilities | camelCase | `battle-engine.ts` |
| Types | camelCase or PascalCase | `card.ts`, `CardTypes.ts` |
| Constants | SCREAMING_SNAKE_CASE | `RARITY_VALUES` |

### CSS & Styling

- Use Tailwind CSS utility classes
- Follow Tailwind naming conventions
- Extract repeated patterns to shared components
- Use `clsx` for conditional class names

**Good:**
```tsx
<div className={clsx(
  'p-4 rounded-lg',
  isActive && 'bg-blue-500',
  className
)} />
```

## 🌳 Branch Strategy

### Branch Types

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/add-card-rarity` |
| `fix/` | Bug fixes | `fix/battle-damage-calculation` |
| `refactor/` | Code refactoring | `refactor/card-generator` |
| `docs/` | Documentation | `docs/update-readme` |
| `test/` | Test additions | `test/add-battle-tests` |
| `hotfix/` | Urgent production fixes | `hotfix/security-patch` |

### Branch Workflow

```bash
# 1. Ensure your main branch is up to date
git checkout main
git fetch upstream
git merge upstream/main

# 2. Create a new feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes
# ... edit files ...

# 4. Commit your changes
git add .
git commit -m "Add feature description"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Open a Pull Request on GitHub
```

## 💬 Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, semicolons, etc) |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### Examples

```
feat(battle): add critical hit calculation

- Add crit chance based on card attack stat
- Implement 1.5x damage multiplier
- Update battle logs for critical hits

Closes #123
```

```
fix(card): correct rarity calculation for low balance wallets

The calculateRarity function was returning legendary for 
portfolios under 10000 USD due to incorrect threshold comparison.

Fixes #456
```

```
docs(readme): update installation instructions

- Add WalletConnect project ID requirement
- Clarify Mantle network setup steps
- Add troubleshooting section
```

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes**
   - Run `npm run lint` and fix any issues
   - Run `npm run build` to ensure no build errors
   - Test manually in development mode

2. **Update documentation**
   - Update relevant docs if adding features
   - Add JSDoc comments for new functions
   - Update type definitions

3. **Self-review**
   - Review your diff before creating PR
   - Remove debug code and console logs
   - Ensure no sensitive data committed

### Pull Request Template

```markdown
## Description
[Description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
[List related issues]

## Testing
[Description of testing performed]

## Screenshots
[If UI changes, add screenshots]

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix works
- [ ] New and existing tests pass locally
```

### Review Process

1. Maintainers will review your PR
2. Address any feedback requested
3. Once approved, maintainers will merge
4. Your changes will be deployed in the next release

## 🐛 Reporting Issues

### Bug Reports

Include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, browser)
- Error messages and stack traces

### Feature Requests

Include:
- Clear problem description
- Proposed solution
- Alternative solutions considered
- Any relevant mockups or examples

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Wagmi Documentation](https://wagmi.sh)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Mantle Developer Docs](https://docs.mantle.xyz)

## 🙏 Acknowledgments

Thank you to all contributors who have helped make MantleCards better!

---

<p align="center">
  Made with ❤️ for the Web3 gaming community
</p>

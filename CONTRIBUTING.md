# Contributing to Auth Setup

Thanks for your interest in contributing! 🎉

## Getting Started

1. Fork the repo
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/auth-setup.git`
3. Install dependencies: `bun install`
4. Create a branch: `git checkout -b feature/your-feature`

## Development

```bash
# Run in development
bun run dev

# Test in a real project
cd ../test-project
bun ../auth-setup/src/index.ts

# Build
bun run build

# Test the built version
cd ../test-project
bunx ../auth-setup
```

## Adding a New Provider

1. Create generator folder: `src/generators/your-provider/`
2. Create templates folder: `src/generators/templates/your-provider/`
3. Implement generator functions
4. Add to `src/prompts.ts` options
5. Add to `src/index.ts` switch case
6. Add dependencies to `src/package-manager.ts`
7. Test thoroughly!

## Code Style

- Use TypeScript
- Follow existing patterns
- Keep functions small and focused
- Add comments for complex logic
- Use meaningful variable names

## Testing

Before submitting a PR, test:

- [ ] CLI runs without errors
- [ ] All prompts work
- [ ] Files are generated correctly
- [ ] Works with Next.js
- [ ] Works with/without ORM
- [ ] Build succeeds

## Commit Messages

Use conventional commits:

- `feat: add Lucia support`
- `fix: resolve schema generation bug`
- `docs: update README with examples`

## Submitting a PR

1. Push your branch
2. Create a Pull Request
3. Describe your changes
4. Link any related issues

## Questions?

Open an issue or reach out on Twitter [@sidgaikwad](https://twitter.com/sidgaikwad)

Thanks for contributing! 🚀

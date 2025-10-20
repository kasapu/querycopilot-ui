# Contributing to QueryCopilot

Thank you for your interest in contributing to QueryCopilot! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/nl2sql.git`
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`

## Development Workflow

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test thoroughly

3. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "Add: New feature description"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier compatible)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

## Commit Message Guidelines

Use clear, descriptive commit messages:

- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for updates to existing features
- `Refactor:` for code refactoring
- `Docs:` for documentation changes
- `Style:` for formatting changes

Example: `Add: Support for Oracle database dialect`

## Testing

Before submitting a PR:

1. Test all database dialects
2. Verify copy/download functionality
3. Test governance rules application
4. Check responsive design on different screen sizes
5. Ensure no console errors

## Reporting Issues

When reporting issues, please include:

- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Error messages from console

## Feature Requests

We welcome feature requests! Please:

- Check existing issues first
- Clearly describe the feature and use case
- Explain why it would be valuable

## Questions?

Feel free to open an issue for any questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

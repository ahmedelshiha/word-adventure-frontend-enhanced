# Contributing to Word Adventure

Thank you for your interest in contributing to Word Adventure! This guide will help you get started.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.11+ (for backend development)
- Git
- A modern code editor (VS Code recommended)

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/word-adventure.git
   cd word-adventure
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm run dev
   ```

## 🎯 How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported in [Issues](https://github.com/your-repo/issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Suggesting Features
1. Check existing [Issues](https://github.com/your-repo/issues) and [Discussions](https://github.com/your-repo/discussions)
2. Create a new discussion or issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### Code Contributions

#### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

#### Commit Messages
Follow conventional commits:
- `feat: add new word difficulty system`
- `fix: resolve speech synthesis issue on Safari`
- `docs: update installation instructions`
- `style: improve button hover animations`

#### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Ensure all tests pass
6. Submit a pull request with:
   - Clear title and description
   - Link to related issues
   - Screenshots for UI changes

## 🎨 Design Guidelines

### Kid-Friendly Principles
- **Visual First** - Use emojis, colors, and images
- **Simple Language** - Clear, age-appropriate text
- **Immediate Feedback** - Quick responses to actions
- **Safety** - No external links or data collection

### Code Style
- Use TypeScript for new components
- Follow existing naming conventions
- Add comments for complex logic
- Keep components small and focused

### UI/UX Guidelines
- Maintain consistent spacing (Tailwind classes)
- Use the established color palette
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test on mobile devices

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Writing Tests
- Add unit tests for utility functions
- Add component tests for React components
- Add integration tests for user flows
- Use descriptive test names

## 📝 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document component props with PropTypes or TypeScript
- Include usage examples for complex components

### User Documentation
- Update README.md for new features
- Add screenshots for UI changes
- Update installation instructions if needed

## 🔍 Code Review Process

### For Contributors
- Respond to feedback promptly
- Make requested changes in new commits
- Ask questions if feedback is unclear

### For Reviewers
- Be constructive and specific
- Focus on code quality and user experience
- Consider the kid-friendly nature of the app

## 🏆 Recognition

Contributors will be:
- Listed in the README.md
- Mentioned in release notes
- Invited to join the core team (for regular contributors)

## 📞 Getting Help

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Discord** - Real-time chat with the community
- **Email** - Direct contact for sensitive issues

## 📋 Checklist

Before submitting a PR, ensure:
- [ ] Code follows the style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Changes are tested on mobile
- [ ] Accessibility is maintained
- [ ] No console errors or warnings

Thank you for contributing to Word Adventure! 🌟


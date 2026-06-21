# ch-3 Personal Project — Report

github_username: luna-devhub
personal_repo_url: https://github.com/luna-devhub/little-archive
project_summary: A mobile app for cataloging physical objects (nature specimens, antiques, art) with AI-powered identification and scrapbook-style collections
slides_url: slides/pitch.md

## Methodology

A project-based approach was used, starting with brainstorming using the Superpowers skill to generate ideas and define the project scope. A detailed plan was then written to outline the implementation phases. The project was built phase by phase across 6 stages: (1) project scaffolding and navigation setup, (2) Firebase authentication and database integration, (3) UI components and theme system, (4) collections and items management, (5) AI integration with Gemini API for object identification and removebg API for background removal, and (6) code review, debugging, and polish. Throughout development, Claude Code's MCP servers, agents, and skills were leveraged to accelerate development and maintain code quality.

## Evidence — Claude Code usage

### MCP
- path: .mcp.json
- what: Configured Firebase MCP server for database operations and auth management. Also used Expo MCP (authenticated via plugin), Context7 MCP for library documentation lookup, and Claude-mem MCP for memory and search capabilities.

### Skill
- path: .claude/skills/little-archive-helper/SKILL.md
- what: Project-specific skill that provides context about Little Archive's architecture, patterns, and common tasks for Claude Code to use when working on the project.

### Agent
- path: .claude/agents/code-reviewer.md
- what: Reviews code for correctness, consistency, theme adherence, and removes residue code (unused imports, dead code, debug logs).

### Agent
- path: .claude/agents/code-cleaner.md
- what: Removes unused imports, dead code, commented-out blocks, and debug console.log statements to keep the codebase clean.

### Agent
- path: .claude/agents/debugger.md
- what: Systematically finds and fixes bugs using a structured process: understand, reproduce, isolate, fix, verify.

### Agent
- path: .claude/agents/ui-ux-reviewer.md
- what: Reviews UI/UX design for visual consistency, accessibility, mobile UX best practices, and adherence to the vintage/journal aesthetic.

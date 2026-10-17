# Dev Days Quiz: Copilot instructions

## Project
Small quiz web app for a workshop. Plain HTML, CSS and JavaScript. Run tests with `npm test`.

## Rules
- No frameworks, build tools or npm dependencies.
- Pure logic lives in `src/quiz.js` and is exported via `module.exports`.
- DOM and event code lives in `src/app.js`. Data lives in `src/questions.js`.
- Colors only via CSS variables in `:root` in `src/style.css`.
- Accessible UI: buttons for actions, visible focus, `aria-live` for changing messages.

## How I like code written
- Small functions with clear names and early returns.
- `const`/`let`, never `var`. Comments only for non-obvious logic.
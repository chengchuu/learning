# Repository Guidelines

## Project Structure & Module Organization

This repository is a collection of dated learning notes and runnable examples, not a single application. Topic directories such as `JavaScript Enlightenment/`, `Note/`, and `Interviews/` contain HTML, JavaScript, CSS, and related assets. Long-form articles live in `Blog/`; archived publication copies live in `TCloud/`. Go exercises are isolated in `The Go Programming Language/`, which is the only directory with a module manifest (`go.mod`). Keep images, styles, and scripts beside the lesson that uses them unless an existing subtree has its own asset convention.

## Build, Test, and Development Commands

There is no repository-wide build or package manifest. Run checks within the area you change:

- `npx markdownlint-cli2 "**/*.md"` checks Markdown using `.markdownlint.json`.
- `cd "The Go Programming Language" && go test ./...` compiles every Go exercise; no test files currently exist.
- `gofmt -w path/to/file.go` formats changed Go source before review.
- `python3 -m http.server 8000` serves static examples from the repository root at `http://localhost:8000/`.

Open changed HTML examples in a browser and inspect the console, layout, and referenced local assets.

## Coding Style & Naming Conventions

Use LF line endings, a final newline, and no trailing whitespace, matching `.vscode/settings.json`. Markdown uses ATX headings, dash bullets, two-space nested-list indentation, fenced backtick blocks, and a 500-character line limit. Preserve the style of historical examples; avoid broad modernization of lesson code. Format Go with `gofmt`. Follow established date-based paths and filenames, such as `Blog/20260613-macOS-scutil.md` and `Note/Archives/2019/20190117/test0.html`.

## Testing Guidelines

Add focused verification near the changed material. Name Go tests `*_test.go` and functions `TestXxx`; run `go test ./...` from the Go module. For static examples, document manual browser coverage in the pull request. No coverage threshold is configured.

## Commit & Pull Request Guidelines

Recent history generally uses Conventional Commit-style subjects: `feat: ...`, `docs(log): ...`, and `style(log): ...`. Use an imperative, concise subject with a relevant scope when useful. Pull requests should summarize the affected topics, list validation performed, link related issues, and include screenshots for visible HTML/CSS changes. Keep unrelated archival or formatting changes out of the same pull request.

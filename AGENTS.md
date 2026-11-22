# Repository Guidelines

## Project Structure & Module Organization

This repository contains technical articles, learning notes, and standalone examples. Topic directories such as `JavaScript Enlightenment/`, `Note/`, and `Interviews/` contain HTML, JavaScript, CSS, and related assets. Archived publication copies live in `TCloud/`. Go exercises live in `The Go Programming Language/`, the repository's only Go module. Keep images, styles, and scripts beside the lesson that uses them unless the subtree has its own asset convention.

Work from the directory of the example you are changing. The package manifest in `Node.js/2022/20220223/` belongs to that lesson. Its `npm test` script is a placeholder that exits with an error.

## Blog workflow

- Find articles directly under `Blog/` and in topic folders such as `Blog/Docker/`, `Blog/Git/`, and `Blog/Linux/`. Curated reference articles live in `Blog/Pinned/`.
- Use `draft-<topic>.md` for working drafts and `YYYYMMDD-<topic>.md` for dated articles. Check for an existing dated version before editing a draft or creating a duplicate. For example, [the basic frp deployment guide](Blog/20261121-docker-frp.md) is a dated article.
- Follow [the Blog writing guidelines](Blog/writing-guidelines.md) for Chinese prose. Use [the Blog templates](Blog/README.md) for content notices, update records, and copyright notices when applicable. Preserve existing author attribution, source URLs, and article IDs.
- For publication drafts, keep the source URL and article ID placeholders until the final values are confirmed. When adding a publication summary and hashtags, place the summary below the cover image and put the tags in a fenced `plain` block after the copyright footer. Keep English and Chinese tags on separate lines.
- Keep each article's language, heading structure, and technical literals consistent. If an article has a table of contents, update its labels and anchors when headings change. Keep related translations and archived copies outside the edit unless the task calls for syncing them.
- When updating the root [README](README.md), keep its latest-articles list limited to dated English-language articles. Verify the linked article's language and sort by the date in the filename, newest first.
- Keep editing and validation instructions in this guide. Omit references to `AGENTS.md` from the root README.

## Build, Test, and Development Commands

Run checks within the area you change. The repository has no shared build or root package manifest.

- From the repository root, run `npx markdownlint-cli2 "<article-path>"` for one article. Replace `<article-path>` with its repository-relative path. Run `npx markdownlint-cli2 "**/*.md"` for a repository-wide check. Both use `.markdownlint.json`.
- `cd "The Go Programming Language" && go test ./...` checks the Go exercises in their module. Packages reported as `[no test files]` are compile checks.
- `gofmt -w path/to/file.go` formats changed Go source before review.
- `python3 -m http.server 8000` serves static examples from the repository root at `http://localhost:8000/`.

Open changed HTML examples in a browser and inspect the console, layout, and referenced local assets.

## Coding Style & Naming Conventions

Use LF line endings, a final newline, and no trailing whitespace, matching `.vscode/settings.json`. Markdown uses ATX headings, dash bullets, two-space nested-list indentation, and fenced backtick blocks. The 500-character line limit excludes code blocks and tables. Preserve the style and date-based paths of historical examples. Format Go with `gofmt`.

## Testing Guidelines

For Markdown changes, check affected links and anchors and run `git diff --check`. When changing runnable examples in articles, validate the changed commands and configurations in an isolated environment where practical. For Compose examples, check the configuration with `docker compose config`. If Docker is available, run the documented workflow and verify its expected result. Report configuration checks and runtime results separately.

For articles with multiple deployment variants, test each affected variant separately. Label the expected output and the observed results. Record test-only substitutions, such as loopback bindings, temporary ports, or `curl --resolve` mappings, so readers can distinguish a local test from a public deployment.

Name Go tests `*_test.go` and functions `TestXxx`. For static examples, document manual browser coverage in the pull request.

## Commit & Pull Request Guidelines

Recent history generally uses Conventional Commit-style subjects: `feat: ...`, `docs(log): ...`, and `style(log): ...`. Use an imperative, concise subject with a relevant scope when useful. Pull requests should summarize the affected topics, list validation performed, link related issues, and include screenshots for visible HTML/CSS changes. Keep unrelated archival or formatting changes out of the same pull request.

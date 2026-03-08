<!-- omit from toc -->
# [EN] Troubleshooting `exec /PATH/entrypoint.sh` Docker Errors — Causes, Diagnostics, and Fixes

![Docker](http://blog.mazey.net/wp-content/uploads/2023/01/Docker_SF_7x3.jpg)

This guide analyzes common Docker startup failures like "no such file or directory" or "permission denied" involving "entrypoint.sh". Key causes include CRLF line endings, missing execution bits, incorrect shebangs, and architecture mismatches. It provides diagnostic steps (e.g., "sed -n l") and fixes such as using ".gitattributes" for LF normalization, applying "sed -i 's/\r$//'" in Dockerfiles to avoid extra packages, and handling archived Debian repositories (e.g., "node:10-buster") for legacy builds.

- [Overview](#overview)
- [Why "entrypoint.sh exists but won't exec"](#why-entrypointsh-exists-but-wont-exec)
- [Quick diagnostics you can run (from host)](#quick-diagnostics-you-can-run-from-host)
- [Fixes and recommended patterns](#fixes-and-recommended-patterns)
- [CI and developer workflow suggestions](#ci-and-developer-workflow-suggestions)
- [Troubleshooting checklist](#troubleshooting-checklist)
- [TL;DR](#tldr)

## Overview

- Symptoms: Docker container fails at startup with errors like:
  - `exec /PATH/entrypoint.sh: no such file or directory`
  - `standard_init_linux.go:xxx: exec user process caused: permission denied`
  - `exec user process caused: exec format error`
- Common root causes: CRLF line endings, missing execute bit, wrong shebang/interpreter, bind mount shadowing files, architecture mismatch, and EOL base-image package repository issues.
- This article explains why each happens, how to diagnose it, and practical fixes (including examples for Debian- and Node-based images such as "debian:bookworm-slim" and "node:10-buster").

## Why "entrypoint.sh exists but won't exec"

1. CRLF vs LF line endings
  If the script has Windows CRLF endings, the shebang line (e.g. `#!/bin/sh`) may end with a carriage return (^M). The kernel then tries to exec an interpreter with a name that includes a trailing CR, which doesn't exist → "no such file or directory" or similar.
2. Not executable (permission denied)
  The file must have the executable bit set inside the image. Host bind mounts may lose the bit on some platforms.
3. Wrong interpreter in shebang
  The shebang might reference `/bin/bash` which is absent (e.g. alpine images) or a wrong path.
4. Bind mount overwrote the image file
  A host directory mounted to the same path replaces the image contents; if the host lacks entrypoint.sh, the container won't find it.
5. Binary format/architecture mismatch
  If entrypoint is a binary for a different CPU architecture, you'll get "exec format error".
6. Package repository / apt errors during build
  Older distro tags (e.g., buster) may be archived; `apt-get install` may fail during build (e.g., when installing dos2unix).

## Quick diagnostics you can run (from host)

- Run an interactive shell in the image:
  - `docker run --rm -it --entrypoint /bin/sh IMAGE_NAME`
  - `docker-compose run --rm SERVICE_NAME sh`
- Inside container:
  - `ls -l /PATH/entrypoint.sh`
  - `stat /PATH/entrypoint.sh`
  - `head -n1 /PATH/entrypoint.sh | sed -n l`
  - `file /PATH/entrypoint.sh`
  - `od -c /PATH/entrypoint.sh | head`

## Fixes and recommended patterns

(1) Best practice: normalize line endings at source (CI / git)

  Use `.gitattributes` to force LF for shell scripts:

  ```plain
  # .gitattributes
  *.sh text eol=lf
  ```

  Configure repos/CI to run dos2unix or equivalent as needed, so images never need the tool.

(2) Convert line endings in Dockerfile without adding packages

  sed in Debian-based images (works on "debian:bookworm-slim", "node:10-buster"):

  ```dockerfile
  FROM node:10-buster

  COPY entrypoint.sh /PATH/entrypoint.sh

  # Convert CRLF -> LF and set executable bit without installing extra packages
  RUN sed -i 's/\r$//' /PATH/entrypoint.sh \
   && chmod +x /PATH/entrypoint.sh

  ENTRYPOINT ["/PATH/entrypoint.sh"]
  ```

  tr approach:
  `RUN tr -d '\r' < /PATH/entrypoint.sh > /PATH/entrypoint.sh.new && mv /PATH/entrypoint.sh.new /PATH/entrypoint.sh`

(3) Install dos2unix during build (when preferred)

  On Debian-based images (bookworm-slim), dos2unix is available in apt:

  ```dockerfile
  FROM debian:bookworm-slim

  COPY entrypoint.sh /PATH/entrypoint.sh

  RUN apt-get update \
    && apt-get install -y --no-install-recommends dos2unix \
    && dos2unix /PATH/entrypoint.sh \
    && chmod +x /PATH/entrypoint.sh \
    && rm -rf /var/lib/apt/lists/*
  ```

  Caveat: older base tags (e.g., "node:10-buster") may fail fetching apt metadata because the release is archived. See Section 6 below for handling archived Debian releases.

(4) Make sure script is executable

  Either set on host before build:
  `chmod +x entrypoint.sh`
  COPY will preserve mode in most cases.
  Or set in Dockerfile:
  `RUN chmod +x /PATH/entrypoint.sh`

(5) Use a shebang that matches the base image

  1. Alpine: use `#!/bin/sh` (Alpine’s `/bin/sh` is BusyBox)
  2. Debian-based images: `/bin/bash` is usually present on non-alpine, but minimal images may only have `/bin/sh`
  3. As a robust pattern, call via explicit shell in ENTRYPOINT if you cannot guarantee interpreter:
  `ENTRYPOINT ["sh", "/PATH/entrypoint.sh"]`

(6) Handling EOL/archived Debian images ("node:10-buster" example)

  1. Problem: apt-get update fails with 404/502 because Debian buster is archived.
  2. Options:
    - Preferred: upgrade to a supported Node image ("node:18"/"node:20-bullseye"/"node:20-bookworm").
    - Minimal workaround (avoid apt): use sed/tr as above to remove CRLF — avoids touching apt entirely.
    - If you must apt-install on an archived release, use archive.debian.org and disable valid-until:
    ```dockerfile
    FROM node:10-buster
    # switch sources to archive (temporary)
    RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list \
     && sed -i 's|http://security.debian.org/debian-security|http://archive.debian.org/debian-security|g' /etc/apt/sources.list || true \
     && echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until \
     && apt-get update -o Acquire::Check-Valid-Until=false \
     && apt-get install -y --no-install-recommends dos2unix \
     && rm -rf /var/lib/apt/lists/*
    ```
    Note: This is insecure/temporary. Archive repos are not maintained. Upgrade ASAP.

(7) Bind mounts can hide your entrypoint

  1. If you bind-mount a host directory to `/PATH` in docker-compose (e.g., ./PATH:/PATH) and the host directory does not include `entrypoint.sh`, the container’s entrypoint (which existed in the image) is hidden by the mount. Ensure host folder contains the script or avoid mounting directly over the path with entrypoint.
  2. Example docker-compose pitfall:
    ```plain
    volumes:
    ./PATH:/PATH
    ```

(8) Windows hosts and executable bit

  On Windows, bind mounts may not preserve the executable bit. Solutions:
    1. Use `ENTRYPOINT ["sh", "/PATH/entrypoint.sh"]` which sidesteps exec permission on Windows bind mounts.
    2. Use named Docker volumes instead of host bind mounts.
    3. Set execute bit in image and avoid mounting over that path.

(9) Architecture mismatch

  If your entrypoint is a binary compiled for another CPU (e.g., ARM on x86), you'll see "exec format error". Ensure binaries are built for the target platform or use multi-arch images.

(10) Recommended final Dockerfile pattern (small, robust)

  Normalize line endings, set permissions, and avoid unnecessary packages:

  ```dockerfile
  FROM debian:bookworm-slim

  WORKDIR /PATH
  COPY entrypoint.sh /PATH/entrypoint.sh

  # strip CRLF with POSIX tools, make executable
  RUN sed -i 's/\r$//' /PATH/entrypoint.sh \
   && chmod +x /PATH/entrypoint.sh

  ENTRYPOINT ["/PATH/entrypoint.sh"]
  ```

## CI and developer workflow suggestions

- Enforce LF in repo via .gitattributes:

  ```plain
  *.sh text eol=lf
  ```

- Add a CI step that validates shell scripts:
  - Check for CRLF: `git grep -I --name-only $'\r' || true`
  - Lint shell scripts (shellcheck)
- Ensure developers’ editors/IDEs are configured to save LF for repository files.

## Troubleshooting checklist

- Copy/paste the exact error message.
- Check `ls -l` and `head -n1 | sed -n l` for CRLF and permissions.
- If `apt install` fails on old images, try sed conversion first or upgrade the base image.
- If using bind mounts, verify host path contents and permissions.
- If architecture or shebang issues suspected, confirm interpreter paths and binary architectures.

## TL;DR

The most common cause of "exec /PATH/entrypoint.sh" failures when the file exists is CRLF line endings. Fix by converting to LF (preferably in source or CI). Use `sed -i 's/\r$//'` in Dockerfile if you want a package-free fix. Ensure executable bit, correct shebang, and beware host bind mounts that can overwrite image files. Prefer upgrading from EOL images (e.g., "node:10-buster") to supported images; if you must use EOL images and apt, point apt to archive.debian.org (temporary and insecure).

**Copyright Notice**

This article is an original work. The author reserves all rights. If you wish to republish, please retain the full content of this article and include a hyperlink referencing both the author and the source.

Author: [Cheng](https://github.com/chengchuu)
Source: <http://blog.mazey.net/6205.html>

(The End)

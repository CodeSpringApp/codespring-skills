# CLAUDE.md — macOS app

Agnostic starter. Replace every `<…>` with your project's real values, then delete this line.

## Project
- **What it is:** <one sentence>
- **Stack:** Swift <version> · <SwiftUI / AppKit> · min macOS <version> · <deps: SPM packages>
- **Targets:** app `<name>`, tests `<name>`; schemes: `<list>`. Sandboxed: <yes/no>.

## Commands
```bash
# Build
xcodebuild -scheme <Scheme> -destination 'platform=macOS' build
# Test
xcodebuild -scheme <Scheme> -destination 'platform=macOS' test
# Format / lint
<swiftformat . / swiftlint>
# Run the built app
open <path-to-.app>   # or run from Xcode
```
Run tests before considering a change done.

## Conventions
- Architecture: `<MVVM / …>`. Views in `<dir>`, view models in `<dir>`, services in `<dir>`.
- SwiftUI/AppKit boundaries: `<how the two interop, if both>`.
- Concurrency: `async/await` + actors; UI work on the main actor.
- Windows/menus/commands: follow the existing `<WindowGroup / AppKit>` patterns.
- Reuse existing components and services before adding new ones.

## Shared systems — do not duplicate or break
- **File-system access & bookmarks:** `<how>` — respect sandbox entitlements and security-scoped bookmarks; don't broaden entitlements unprompted.
- **Persistence / local index / caches:** `<where>` — follow the existing schema and paths.
- **Networking / API layer:** `<where>` — route new calls through it.
- **Auth / keychain / secrets:** `<how>` — reuse; never hardcode.
- **Background work / XPC / helpers, notifications:** `<patterns>` — reuse.
- **External binaries/tools** (e.g. ffmpeg): `<how they're bundled/invoked>` — reuse the wrapper.

## Guardrails
- Smallest change that satisfies the task; don't restructure modules unprompted.
- Keep the app compiling and tests green; verify by launching the app.
- Respect the sandbox and entitlements; don't add capabilities unless asked.
- Don't commit secrets or signing profiles.

## Testing / verification
- <how to launch and what "working" looks like>
- <unit/UI test targets and how to run them>

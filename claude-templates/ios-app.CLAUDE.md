# CLAUDE.md — iOS app

Agnostic starter. Replace every `<…>` with your project's real values, then delete this line.

## Project
- **What it is:** <one sentence>
- **Stack:** Swift <version> · <SwiftUI / UIKit> · min iOS <version> · <deps: SPM packages>
- **Targets:** app `<name>`, tests `<name>`; schemes: `<list>`.

## Commands
```bash
# Build (use xcodebuild or xcodebuildmcp if available)
xcodebuild -scheme <Scheme> -destination 'platform=iOS Simulator,name=<iPhone 15>' build
# Test
xcodebuild -scheme <Scheme> -destination 'platform=iOS Simulator,name=<iPhone 15>' test
# Format / lint
<swiftformat . / swiftlint>
```
Prefer building against a simulator destination. Run tests before considering a change done.

## Conventions
- Architecture: `<MVVM / TCA / …>`. Views in `<dir>`, view models in `<dir>`, models in `<dir>`, services in `<dir>`.
- SwiftUI: keep views small; push logic into view models; use `@State`/`@Observable`/`<pattern>` consistently.
- Concurrency: use `async/await` and actors; keep UI work on the main actor.
- Reuse existing components, modifiers, and services before adding new ones.

## Shared systems — do not duplicate or break
- **Networking / API layer:** `<where>` — route new calls through it, don't create ad-hoc URLSession code.
- **Persistence:** `<SwiftData / CoreData / files>` — follow the existing schema; never break a shipped store without a migration.
- **Auth / keychain / secrets:** `<how>` — reuse; never hardcode keys.
- **Payments (StoreKit) / entitlements:** `<system>` — reuse the existing manager.
- **Background tasks / notifications:** `<patterns>` — reuse.

## Guardrails
- Smallest change that satisfies the task; don't restructure modules unprompted.
- Keep the app compiling and the tests green; verify on the simulator.
- Respect Info.plist entitlements/capabilities; don't add capabilities unless asked.
- Don't commit secrets or signing profiles.

## Testing / verification
- <how to run in the simulator and what "working" looks like>
- <unit/UI test targets and how to run them>

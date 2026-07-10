# CWSP-reborn Views and Design Analysis

- **Observed:** 2026-07-10
- **Packages:** AirPad, Network, Settings, Debug, Developer
- **Evidence:** source/components/styles/package metadata; no rendered-session validation

## Shared composition

The shared view registry lazy-loads view factories and the shell enablement layer
selects allowed views. Settings is treated as a required recovery surface.
CWSP-reborn reaches the packages through `src/frontend/submodules/views`.

The design should preserve this separation:

```text
shell navigation
  -> view lifecycle
  -> view-local controller/state
  -> shared config/transport contracts
  -> native or endpoint adapter
```

## AirPad

### Existing component regions

- app loader/error/retry shell;
- touch/trackpad input surface;
- action rail for connection and clipboard actions;
- keyboard and speech-related modules;
- side-panel/config host;
- clipboard toolbar;
- motion rate, quantization, diagnostics, and KVM session state.

### Existing design traits

- phone-first gesture surface;
- explicit touch-action handling;
- compact action controls;
- shell flex/overflow integration;
- app icons in SVG form;
- lifecycle handling that includes orientation behavior.

### Risks

- new input/network projections are incomplete;
- legacy-named implementations are still required;
- orientation APIs must be gated outside supported mobile surfaces;
- high-frequency movement must not be tied to UI render cadence;
- emoji/icon-only controls require consistent accessible labels and focus policy.

## Network

### Existing component regions

- connection status header;
- WS hub and native-runtime cards;
- configuration summary;
- probe/reconnect actions;
- per-origin probe results;
- frontend/logcat export actions;
- bounded log output area.

### Responsive opportunity

The current source is mainly a single-column diagnostic layout. A future
wide-screen composition can use:

```text
left: connection and platform status
right: probes, logs, and recent route events
bottom or drawer: corrective actions and settings link
```

This is a proposal, not current implementation. Mobile remains a vertical card
flow with primary actions near the top.

## Settings

### Existing component regions

- header and tab list;
- built-in sections;
- contributed CWSP/AirPad/device sections;
- save/load behavior;
- shell-profile filtering;
- cross-surface settings sync adapter.

### Current responsive behavior

- compact/mobile shell profile can hide desktop-only sections;
- desktop width allows a broader horizontal navigation treatment;
- styles use semantic token fallbacks and container-aware sizing.

### Design requirement

Presentation profiles may differ, but persisted keys and backend ownership must
not. A hidden desktop-only tab cannot erase its values during a mobile save.

## Debug

The package is an empty scaffold. Its future UI should be observational:

- connection and peer filter;
- severity/scope filter;
- bounded live stream;
- backlog/tail pagination;
- correlation and route context;
- copy/export with redaction;
- paused state that does not stop ingestion.

It must not own packet injection or privileged actions.

## Developer

The package is an empty scaffold and currently inherits debug identity in
metadata. Its future UI may contain:

- normalized packet inspector;
- fixture-based request composer;
- capability probes;
- route simulation;
- settings contribution diagnostics.

All mutation/injection controls must be development-only, explicit, and absent
from production builds by default.

## Mobile layout

Recommended shell:

```text
top: connection state and selected target
main: active view
bottom: minimal navigation
```

View priority:

1. AirPad for active control;
2. Network for recovery;
3. Settings for configuration.

Requirements:

- touch targets at least 44 CSS pixels;
- safe-area insets;
- no hover-only interaction;
- keyboard and screen-reader labels;
- reduced-motion support;
- route/connection failure visible without opening developer tools.

## Desktop and wide-screen layout

Recommended shell:

```text
navigation rail | primary workspace | optional diagnostics pane
```

- Network may occupy the primary workspace.
- Settings may open as a full view or a persistent secondary pane.
- Debug may be a docked diagnostics pane.
- Developer remains opt-in.
- AirPad is omitted from WebNative unless a later requirement defines a local
  controller use case.

## Shared design tokens

Future consolidation should standardize:

- surface and on-surface colors;
- status colors with text/icon redundancy;
- spacing and control-height scale;
- view maximum width;
- shell navigation dimensions;
- focus ring;
- log/monospace typography;
- mobile safe-area variables.

Do not duplicate those tokens per platform shell.

## Accessibility and test gates

- Shell landmarks and view title association.
- Keyboard order and visible focus.
- `aria-live` for connection changes, not high-frequency packet logs.
- Pause/buffer strategy for live debug output.
- Reduced-motion and high-contrast checks.
- Mobile and desktop layout snapshots after build entrypoints exist.
- Functional tests for retry, reconnect, save, contribution pruning, and route selection.

## Local visual assets

The AirPad package contains SVG app and maskable icons. No authoritative product
mockup was found in the audited view sources. Desktop layout guidance above is
therefore derived from existing components and shell roles, not from a supplied design image.

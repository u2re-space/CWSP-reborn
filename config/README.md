# CWSP-reborn Configuration Boundary

- **Updated:** 2026-07-10
- **Status:** documentation scaffold; no runtime config is authoritative yet

## Purpose

This directory will contain safe shared defaults and schemas. It must not become
a store for credentials or machine-specific private access data.

## Ownership layers

Configuration resolves in this order:

1. schema and safe product defaults;
2. persisted user settings;
3. platform/native settings;
4. endpoint/gateway policy;
5. explicit environment overrides;
6. private secret providers outside tracked public config.

Later layers may override earlier values only for fields they own.

## Required sections

### Core identity

- local logical endpoint ID (short form preferred: `L-110`, `L-196`, `L-200`, `L-208`, `L-210`);
- long forms (`L-192.168.0.xxx`) remain aliases for compatibility;
- roles and enabled modules;
- safe display name;
- capability flags.

### Network

- endpoint/gateway candidates;
- direct target candidates;
- destination IDs;
- bridge/preconnect policy;
- transport preference;
- TLS policy.

Endpoint URL, direct target URL, AirPad quick target, and destination ID are
separate fields.

### Settings synchronization

- schema version;
- persistence surface;
- `settings:get` and `settings:patch` support;
- migration version;
- reload behavior.

### Drivers

- capability enablement;
- ordered implementation preference;
- required permission/service;
- readiness timeout;
- platform-specific options.

### Diagnostics

- safe log level;
- debug relay enablement;
- bounded backlog;
- redaction policy.

## Proposed future files

The following names are reserved for a later implementation task:

- `schema.json` — shared public schema;
- `defaults.json` — secret-free defaults;
- `platform/android.json` — Android capability defaults;
- `platform/windows.json` — Windows capability defaults;
- `platform/linux.json` — Linux capability defaults.

They are intentionally not created during Pass I because no backend currently
loads and validates them.

## Security

- Never commit passwords, tokens, private keys, clipboard payloads, or private access notes.
- Environment variable names may be documented; values may not.
- TLS relaxation is explicit, scoped, and development-only.
- Logs and exported diagnostics redact authentication and user payloads.

## Validation requirements

Before a config file becomes authoritative:

- one loader owns it;
- schema validation runs before side effects;
- unknown fields have a defined policy;
- migration and rollback are documented;
- Android and WebNative round-trip tests cover shared fields;
- private overrides remain outside tracked files.

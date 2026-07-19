# Endpoint portable bundle

This bundle is generated from apps/CrossWord/src/endpoint.

## Requirements
- Node.js 22+ and npm

## Run
- Linux/macOS: ./run.sh
- Windows: run.cmd

## Notes
- Node modules mode: none
- This is a slim bundle without node_modules. Run: npm ci --include=dev
- Slim mode auto-installs dependencies on first run via npm.
- PM2 runs `launcher.mjs` (which starts `server-v2/index.ts`). Without PM2, run.sh/run.cmd fall back to `npm run start:direct`.
- Default launcher environment:
  - CWS_TUNNEL_DEBUG=true
  - CWS_SOCKET_IO_ALLOWED_ORIGINS=all
  - CWS_SOCKET_IO_ALLOW_PRIVATE_NETWORK_ORIGINS=true
  - CWS_SOCKET_IO_ALLOW_UNKNOWN_ORIGIN_WITH_AUTH=true
  - CWS_CORS_ALLOW_PRIVATE_NETWORK=true
  - CWS_START_MODE=start
- Set `CWS_START_MODE=watch` to run auto-restart on file changes from the launcher (`start:watch`).
- Archive retention is controlled by `PORTABLE_ARCHIVE_RETENTION_COUNT` (default: 1) in build mode.
- If clipboard backend is unavailable on Linux headless environments, endpoint still starts.

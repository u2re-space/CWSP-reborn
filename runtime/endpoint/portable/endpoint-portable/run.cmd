@echo off
setlocal
cd /d "%~dp0"
if not defined CWS_TUNNEL_DEBUG set "CWS_TUNNEL_DEBUG=true"
if not defined CWS_SOCKET_IO_ALLOWED_ORIGINS set "CWS_SOCKET_IO_ALLOWED_ORIGINS=all"
if not defined CWS_SOCKET_IO_ALLOW_PRIVATE_NETWORK_ORIGINS set "CWS_SOCKET_IO_ALLOW_PRIVATE_NETWORK_ORIGINS=true"
if not defined CWS_SOCKET_IO_ALLOW_UNKNOWN_ORIGIN_WITH_AUTH set "CWS_SOCKET_IO_ALLOW_UNKNOWN_ORIGIN_WITH_AUTH=true"
if not defined CWS_CORS_ALLOW_PRIVATE_NETWORK set "CWS_CORS_ALLOW_PRIVATE_NETWORK=true"
if not defined CWS_START_MODE set "CWS_START_MODE=start"
set "CWS_START_MODE=%CWS_START_MODE%"
if "%CWS_START_MODE%"=="" if "%CWS_START_MODE%"=="" set "CWS_START_MODE=start"
if "%CWS_START_MODE%"=="" set "CWS_START_MODE=%CWS_START_MODE%"
where pm2 >nul 2>&1
if not errorlevel 1 (
  if exist ecosystem.config.cjs (
    for /f "delims=" %%N in ('pm2 describe cws --no-color 2^>nul ^| findstr /C:"cws"') do (
      set "HAS_PM2_APP=1"
    )
    if defined HAS_PM2_APP (
      call pm2 restart cws --update-env
    ) else (
      call pm2 start ecosystem.config.cjs
    )
    if errorlevel 1 (
      echo [portable] PM2 failed to start service.
      pause
      exit /b 1
    )
    exit /b 0
  )
)
where node >nul 2>&1
if errorlevel 1 (
  echo [portable] Node.js 22+ is required.
  pause
  exit /b 1
)
if not exist "node_modules\.bin\tsx.cmd" (
  echo [portable] Installing dependencies ^(first run^)^...
  call npm ci --include=dev
  if errorlevel 1 (
    echo [portable] npm ci failed, retrying with npm install...
    call npm install --include=dev
    if errorlevel 1 (
      echo [portable] Failed to install dependencies.
      pause
      exit /b 1
    )
  )
)

:portable_pm2_fallback
if not exist "launcher.mjs" goto :use_legacy_start
if /I "%CWS_START_MODE%"=="watch" (
  start "" /B /D "%~dp0" npm.cmd run start:watch
) else (
  start "" /B /D "%~dp0" npm.cmd run start:direct
)
exit /b 0
:use_legacy_start
if /I "%CWS_START_MODE%"=="watch" (
  start "" /B /D "%~dp0" npm.cmd run start:watch
) else (
  start "" /B /D "%~dp0" npm.cmd run start
)
exit /b 0

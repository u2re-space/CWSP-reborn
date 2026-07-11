@echo off
:: CWSP Neutralino extNode launcher (Windows)
:: Prefer embedded nodeenv runtime; fall back to system Node on PATH.
:: WHY: install.cmd is not run during Linux→Windows cross-packaging, so
:: _runtime\nodejs-win is usually empty in portable desk packages.
setlocal EnableExtensions
set "PKG=%~1"
if "%PKG%"=="" set "PKG=%~dp0..\.."
set "EMBED=%PKG%\extensions\node\_runtime\nodejs-win\Scripts\node.exe"
set "MAIN=%PKG%\extensions\node\main.js"
set "NODE_BIN="

if exist "%EMBED%" (
  set "NODE_VIRTUAL_ENV=%PKG%\extensions\node\_runtime\nodejs-win"
  set "NODE_PATH=%NODE_VIRTUAL_ENV%\node_modules"
  set "NPM_CONFIG_PREFIX=%NODE_VIRTUAL_ENV%"
  set "PATH=%NODE_VIRTUAL_ENV%\Scripts;%NODE_PATH%;%NODE_PATH%\bin;%PATH%"
  set "NODE_BIN=%EMBED%"
) else (
  where node >nul 2>nul
  if errorlevel 1 (
    echo [extNode] ERROR: no embedded Node and no system node on PATH.
    echo [extNode] Install Node.js or run extensions\node\install.cmd
    exit /b 1
  )
  for /f "delims=" %%N in ('where node') do (
    set "NODE_BIN=%%N"
    goto :have_node
  )
)

:have_node
if "%NODE_BIN%"=="" (
  echo [extNode] ERROR: could not resolve node.exe
  exit /b 1
)

set "CWSP_ROOT=%PKG%"
set "CWSP_DESKTOP_SHELL=neutralino"
set "CWSP_NL_PACKAGE_ROOT=%PKG%"

:: Optional debug inspector: set CWSP_NL_INSPECT=1
if /I "%CWSP_NL_INSPECT%"=="1" (
  "%NODE_BIN%" --inspect "%MAIN%"
) else (
  "%NODE_BIN%" "%MAIN%"
)

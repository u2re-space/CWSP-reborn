@echo off
:: CWSP Neutralino extNode launcher (Windows)
:: Prefer embedded nodeenv runtime; fall back to system Node on PATH.
:: WHY: install.cmd is not run during Linux→Windows cross-packaging, so
:: _runtime\nodejs-win is usually empty in portable desk packages.
::
:: Portable layout beside the .exe:
::   cwsp-neutralino-win_x64.exe
::   cwsp-neutralino-win_x64.tar.gz   (Node backend — unpacked to %%TEMP%% by main.js)
::   .config\                         (durable settings; not wiped by unpack)
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

:: Host root = directory of the .exe (NL_PATH). Backend code may live in TEMP.
if not exist "%PKG%\.config" mkdir "%PKG%\.config" >nul 2>nul
set "CWSP_NL_HOST_ROOT=%PKG%"
set "CWSP_ROOT=%PKG%"
set "CWSP_DESKTOP_SHELL=neutralino"
set "CWSP_NL_PACKAGE_ROOT=%PKG%"
set "CWSP_PORTABLE_CONFIG=%PKG%\.config\portable.config.json"
set "CWS_PORTABLE_CONFIG_PATH=%PKG%\.config\portable.config.json"

:: Optional debug inspector: set CWSP_NL_INSPECT=1
if /I "%CWSP_NL_INSPECT%"=="1" (
  "%NODE_BIN%" --inspect "%MAIN%"
) else (
  "%NODE_BIN%" "%MAIN%"
)
